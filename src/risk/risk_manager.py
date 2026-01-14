"""Risk management system."""
from typing import Optional
from datetime import datetime

from ..data.broker_interface import BrokerInterface
from ..utils.logger import Logger


class RiskManager:
    """Manages trading risk and position sizing."""

    def __init__(self, broker: BrokerInterface, max_position_size: int = 1,
                 max_daily_loss: float = 500.0, max_daily_trades: int = 3,
                 point_value: float = 50.0):
        self.broker = broker
        self.max_position_size = max_position_size
        self.max_daily_loss = max_daily_loss
        self.max_daily_trades = max_daily_trades
        self.point_value = point_value
        self.logger = Logger.get_logger()

        self.daily_pnl = 0.0
        self.trades_today = 0
        self.last_reset_date: Optional[datetime] = None

    def check_can_trade(self) -> tuple[bool, str]:
        """
        Check if trading is allowed based on risk parameters.

        Returns:
            Tuple of (can_trade, reason)
        """
        # Check daily loss limit
        if hasattr(self.broker, 'get_daily_pnl'):
            current_pnl = self.broker.get_daily_pnl()
            if current_pnl <= -self.max_daily_loss:
                return False, f"Daily loss limit reached: ${current_pnl:.2f}"

        # Check daily trade limit
        if hasattr(self.broker, 'get_total_trades'):
            trades = self.broker.get_total_trades()
            if trades >= self.max_daily_trades:
                return False, f"Daily trade limit reached: {trades} trades"

        # Check if we already have a position
        positions = self.broker.get_all_positions()
        if positions:
            return False, "Position already open"

        return True, "OK"

    def calculate_position_size(self, account_balance: float, risk_points: float,
                                risk_percent: float = 0.02) -> int:
        """
        Calculate position size based on risk parameters.

        Args:
            account_balance: Current account balance
            risk_points: Risk per contract in points
            risk_percent: Percentage of account to risk (default 2%)

        Returns:
            Number of contracts to trade
        """
        if risk_points <= 0:
            self.logger.warning("Invalid risk points for position sizing")
            return 1

        # Calculate max risk in dollars
        max_risk_dollars = account_balance * risk_percent

        # Calculate position size
        risk_per_contract = risk_points * self.point_value
        position_size = int(max_risk_dollars / risk_per_contract)

        # Apply max position size limit
        position_size = min(position_size, self.max_position_size)
        position_size = max(position_size, 1)  # Minimum 1 contract

        self.logger.info(
            f"Position sizing: Account=${account_balance:.2f}, "
            f"Risk={risk_points:.2f} points (${risk_per_contract:.2f}), "
            f"Max risk=${max_risk_dollars:.2f}, Position size={position_size} contracts"
        )

        return position_size

    def reset_daily_stats(self):
        """Reset daily statistics."""
        self.daily_pnl = 0.0
        self.trades_today = 0
        self.last_reset_date = datetime.now()

        if hasattr(self.broker, 'reset_daily_stats'):
            self.broker.reset_daily_stats()

        self.logger.info("Daily risk stats reset")

    def should_reset_daily_stats(self, current_time: datetime) -> bool:
        """Check if daily stats should be reset."""
        if self.last_reset_date is None:
            return True

        return current_time.date() != self.last_reset_date.date()

    def get_risk_status(self) -> dict:
        """Get current risk status."""
        status = {
            'max_position_size': self.max_position_size,
            'max_daily_loss': self.max_daily_loss,
            'max_daily_trades': self.max_daily_trades
        }

        if hasattr(self.broker, 'get_daily_pnl'):
            status['current_daily_pnl'] = self.broker.get_daily_pnl()
            status['remaining_loss_limit'] = self.max_daily_loss + self.broker.get_daily_pnl()

        if hasattr(self.broker, 'get_total_trades'):
            status['trades_today'] = self.broker.get_total_trades()
            status['remaining_trades'] = self.max_daily_trades - self.broker.get_total_trades()

        can_trade, reason = self.check_can_trade()
        status['can_trade'] = can_trade
        status['reason'] = reason

        return status

    def log_risk_status(self):
        """Log current risk status."""
        status = self.get_risk_status()
        self.logger.info(
            f"Risk Status - Can Trade: {status['can_trade']}, "
            f"Reason: {status['reason']}"
        )

        if 'current_daily_pnl' in status:
            self.logger.info(f"Daily P&L: ${status['current_daily_pnl']:.2f}")

        if 'trades_today' in status:
            self.logger.info(
                f"Trades today: {status['trades_today']}/{self.max_daily_trades}"
            )
