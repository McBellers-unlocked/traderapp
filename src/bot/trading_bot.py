"""Main trading bot orchestrator."""
from datetime import datetime, time, timedelta
from typing import Optional
import pytz
import time as time_module

from ..data.market_data import MarketDataHandler, Bar
from ..data.paper_broker import PaperBroker
from ..strategy.opening_range import OpeningRange
from ..strategy.breakout_detector import BreakoutDetector, BreakoutSignal
from ..risk.order_manager import OrderManager
from ..risk.risk_manager import RiskManager
from ..utils.config import Config
from ..utils.logger import Logger
from ..utils.news_filter import NewsFilter


class TradingBotState:
    """Enum-like class for bot states."""
    INITIALIZING = "initializing"
    WAITING_FOR_MARKET_OPEN = "waiting_for_market_open"
    CALCULATING_OPENING_RANGE = "calculating_opening_range"
    WAITING_FOR_BREAKOUT = "waiting_for_breakout"
    IN_POSITION = "in_position"
    TRADING_WINDOW_CLOSED = "trading_window_closed"
    STOPPED = "stopped"


class TradingBot:
    """Main trading bot for ES futures opening range breakout strategy."""

    def __init__(self, config: Config):
        self.config = config
        self.logger = Logger.get_logger(log_file=config.log_file, level=config.log_level)

        # Initialize components
        self.timezone = pytz.timezone(config.timezone)
        self.market_data = MarketDataHandler(config.symbol, config.timezone)

        # Use paper broker by default (can be extended to support real brokers)
        self.broker = PaperBroker(initial_balance=100000.0, point_value=50.0)

        self.opening_range = OpeningRange(
            self.market_data,
            or_minutes=config.opening_range_minutes,
            timezone=config.timezone
        )

        self.breakout_detector = BreakoutDetector(
            self.market_data,
            self.opening_range,
            min_breakout_points=config.min_breakout_points,
            volume_multiplier=config.volume_multiplier
        )

        self.order_manager = OrderManager(
            self.broker,
            self.opening_range,
            symbol=config.symbol,
            point_value=50.0
        )

        self.risk_manager = RiskManager(
            self.broker,
            max_position_size=config.max_position_size,
            max_daily_loss=config.max_daily_loss,
            max_daily_trades=config.max_daily_trades,
            point_value=50.0
        )

        self.news_filter = NewsFilter(
            enabled=config.avoid_news_days,
            timezone=config.timezone
        )

        # Bot state
        self.state = TradingBotState.INITIALIZING
        self.is_running = False
        self.current_date: Optional[datetime] = None

        # Trading window times
        self.trading_start_time = self._parse_time(config.trading_window_start)
        self.trading_end_time = self._parse_time(config.trading_window_end)

    def _parse_time(self, time_str: str) -> time:
        """Parse time string to time object."""
        parts = time_str.split(':')
        return time(hour=int(parts[0]), minute=int(parts[1]))

    def start(self):
        """Start the trading bot."""
        self.logger.info("=" * 80)
        self.logger.info("ES FUTURES OPENING RANGE BREAKOUT BOT")
        self.logger.info("=" * 80)

        if not self.broker.connect():
            self.logger.error("Failed to connect to broker")
            return

        self.is_running = True
        self.state = TradingBotState.WAITING_FOR_MARKET_OPEN

        self.logger.info(f"Bot started - Strategy: Opening Range Breakout")
        self.logger.info(f"Symbol: {self.config.symbol}")
        self.logger.info(f"Opening Range: {self.config.opening_range_minutes} minutes")
        self.logger.info(f"Trading Window: {self.config.trading_window_start} - {self.config.trading_window_end}")
        self.logger.info(f"Risk/Reward Ratio: {self.config.risk_reward_ratio}")
        self.logger.info(f"Max Position Size: {self.config.max_position_size} contracts")
        self.logger.info(f"Max Daily Loss: ${self.config.max_daily_loss}")
        self.logger.info("=" * 80)

    def stop(self):
        """Stop the trading bot."""
        self.logger.info("Stopping trading bot...")
        self.is_running = False
        self.state = TradingBotState.STOPPED

        # Close any open positions
        if self.order_manager.has_open_position():
            self.order_manager.close_position("bot_shutdown")

        self.broker.disconnect()
        self.logger.info("Bot stopped")

    def on_bar(self, bar: Bar):
        """
        Process a new price bar.

        Args:
            bar: New price bar
        """
        if not self.is_running:
            return

        # Add bar to market data
        self.market_data.add_bar(
            bar.timestamp, bar.open, bar.high, bar.low, bar.close, bar.volume
        )

        # Update broker with current price
        self.broker.update_market_price(self.config.symbol, bar.close)

        current_time = bar.timestamp

        # Check if we need to reset for a new day
        if self.current_date != current_time.date():
            self._handle_new_day(current_time)

        # State machine
        if self.state == TradingBotState.WAITING_FOR_MARKET_OPEN:
            self._handle_waiting_for_open(current_time)

        elif self.state == TradingBotState.CALCULATING_OPENING_RANGE:
            self._handle_calculating_or(current_time)

        elif self.state == TradingBotState.WAITING_FOR_BREAKOUT:
            self._handle_waiting_for_breakout(current_time, bar)

        elif self.state == TradingBotState.IN_POSITION:
            self._handle_in_position(current_time, bar)

        elif self.state == TradingBotState.TRADING_WINDOW_CLOSED:
            pass  # Wait for next day

    def _handle_new_day(self, current_time: datetime):
        """Handle new trading day."""
        self.logger.info("=" * 80)
        self.logger.info(f"NEW TRADING DAY: {current_time.date()}")
        self.logger.info("=" * 80)

        self.current_date = current_time.date()

        # Check news filter
        allowed, reason = self.news_filter.is_trading_allowed(self.current_date)
        self.news_filter.log_status(self.current_date)

        if not allowed:
            self.logger.warning(f"Trading suspended today: {reason}")
            self.state = TradingBotState.TRADING_WINDOW_CLOSED
            return

        # Reset components
        self.opening_range.reset()
        self.breakout_detector.reset()
        self.risk_manager.reset_daily_stats()

        self.state = TradingBotState.WAITING_FOR_MARKET_OPEN

    def _handle_waiting_for_open(self, current_time: datetime):
        """Handle waiting for market open."""
        if current_time.time() >= self.trading_start_time:
            self.logger.info(f"Market open: {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
            self.state = TradingBotState.CALCULATING_OPENING_RANGE

    def _handle_calculating_or(self, current_time: datetime):
        """Handle calculating opening range."""
        if self.opening_range.calculate(current_time):
            self.logger.info(
                f"Opening Range: High={self.opening_range.get_high():.2f}, "
                f"Low={self.opening_range.get_low():.2f}, "
                f"Range={self.opening_range.get_range():.2f} points"
            )
            self.state = TradingBotState.WAITING_FOR_BREAKOUT

    def _handle_waiting_for_breakout(self, current_time: datetime, bar: Bar):
        """Handle waiting for breakout signal."""
        # Check if trading window is still open
        if current_time.time() >= self.trading_end_time:
            self.logger.info("Trading window closed, no breakout occurred")
            self.state = TradingBotState.TRADING_WINDOW_CLOSED
            return

        # Check risk management
        can_trade, reason = self.risk_manager.check_can_trade()
        if not can_trade:
            self.logger.warning(f"Cannot trade: {reason}")
            self.state = TradingBotState.TRADING_WINDOW_CLOSED
            return

        # Check for breakout
        signal = self.breakout_detector.check_breakout(
            bar,
            require_volume_confirmation=self.config.volume_confirmation
        )

        if signal:
            self._handle_breakout_signal(signal)

    def _handle_breakout_signal(self, signal: BreakoutSignal):
        """Handle breakout signal."""
        self.logger.info("=" * 80)
        self.logger.info(f"BREAKOUT DETECTED: {signal}")
        self.logger.info("=" * 80)

        # Check risk management
        can_trade, reason = self.risk_manager.check_can_trade()
        if not can_trade:
            self.logger.warning(f"Breakout detected but cannot trade: {reason}")
            return

        # Calculate position size
        account_balance = self.broker.get_account_balance()

        # Estimate risk (will be updated after order creation)
        if signal.direction.value == "bullish":
            risk_points = signal.price - self.opening_range.get_low()
        else:
            risk_points = self.opening_range.get_high() - signal.price

        position_size = self.risk_manager.calculate_position_size(
            account_balance, risk_points, risk_percent=0.02
        )

        # Create orders
        success = self.order_manager.create_breakout_orders(
            signal,
            quantity=position_size,
            risk_reward_ratio=self.config.risk_reward_ratio
        )

        if success:
            self.logger.info("Orders created successfully")
            self.logger.info(self.order_manager.get_position_info())
            self.state = TradingBotState.IN_POSITION
        else:
            self.logger.error("Failed to create orders")

    def _handle_in_position(self, current_time: datetime, bar: Bar):
        """Handle active position management."""
        current_price = bar.close

        # Check exit conditions
        exit_reason = self.order_manager.check_exit_conditions(current_price)

        if exit_reason:
            self.logger.info("=" * 80)
            self.logger.info(f"EXIT SIGNAL: {exit_reason}")
            self.logger.info("=" * 80)

            self.order_manager.close_position(exit_reason)

            # Get final statistics
            stats = self.broker.get_statistics()
            self.logger.info(f"Trade Statistics: {stats}")
            self.logger.info(f"Daily P&L: ${self.broker.get_daily_pnl():.2f}")

            self.state = TradingBotState.TRADING_WINDOW_CLOSED
            return

        # Check if trading window closed
        if current_time.time() >= self.trading_end_time:
            self.logger.info("Trading window closed, closing position")
            self.order_manager.close_position("time_limit")

            stats = self.broker.get_statistics()
            self.logger.info(f"Trade Statistics: {stats}")

            self.state = TradingBotState.TRADING_WINDOW_CLOSED

    def get_status(self) -> dict:
        """Get current bot status."""
        status = {
            'state': self.state,
            'is_running': self.is_running,
            'current_date': self.current_date,
            'opening_range_calculated': self.opening_range.is_calculated,
            'has_position': self.order_manager.has_open_position(),
        }

        if self.opening_range.is_calculated:
            status['opening_range'] = {
                'high': self.opening_range.get_high(),
                'low': self.opening_range.get_low(),
                'range': self.opening_range.get_range()
            }

        if self.order_manager.has_open_position():
            status['position'] = self.order_manager.get_position_info()

        status['risk_status'] = self.risk_manager.get_risk_status()
        status['account_balance'] = self.broker.get_account_balance()
        status['daily_pnl'] = self.broker.get_daily_pnl()

        return status
