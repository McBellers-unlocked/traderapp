#!/usr/bin/env python3
"""
Simulator for testing the trading bot with historical data patterns.

This simulates a typical trading day with realistic price movements
to test the opening range breakout strategy.
"""
import sys
import signal
from datetime import datetime, timedelta
import random
import time
import pytz

from src.utils.config import Config
from src.utils.logger import Logger
from src.bot.trading_bot import TradingBot
from src.data.market_data import Bar


class MarketSimulator:
    """Simulates market data for testing the trading bot."""

    def __init__(self, bot: TradingBot, start_price: float = 5000.0):
        self.bot = bot
        self.start_price = start_price
        self.current_price = start_price
        self.timezone = pytz.timezone('America/New_York')
        self.logger = Logger.get_logger()

        # Opening range parameters
        self.or_high = None
        self.or_low = None

    def generate_opening_range(self, current_time: datetime, or_minutes: int = 5):
        """Generate opening range bars."""
        self.logger.info(f"\n{'='*60}")
        self.logger.info("GENERATING OPENING RANGE")
        self.logger.info(f"{'='*60}")

        range_size = random.uniform(3, 8)  # ES typically moves 3-8 points in first 5 min
        self.or_high = self.start_price + range_size / 2
        self.or_low = self.start_price - range_size / 2

        for minute in range(or_minutes):
            bar_time = current_time + timedelta(minutes=minute)
            price = random.uniform(self.or_low, self.or_high)

            bar = Bar(
                timestamp=bar_time,
                open_price=self.current_price,
                high=max(price, self.current_price) + random.uniform(0, 0.5),
                low=min(price, self.current_price) - random.uniform(0, 0.5),
                close=price,
                volume=random.randint(500, 1500)
            )

            self.current_price = price
            self.bot.on_bar(bar)
            self.logger.info(
                f"  {bar_time.strftime('%H:%M')} - "
                f"O:{bar.open:.2f} H:{bar.high:.2f} L:{bar.low:.2f} C:{bar.close:.2f} V:{bar.volume}"
            )

        self.logger.info(f"Opening Range: High={self.or_high:.2f}, Low={self.or_low:.2f}")

    def generate_breakout_scenario(self, current_time: datetime, breakout_type: str = "bullish"):
        """Generate a breakout scenario."""
        self.logger.info(f"\n{'='*60}")
        self.logger.info(f"SIMULATING {breakout_type.upper()} BREAKOUT")
        self.logger.info(f"{'='*60}")

        if breakout_type == "bullish":
            # Price breaks above OR high
            target_price = self.or_high + random.uniform(2, 5)
            direction = 1
        else:
            # Price breaks below OR low
            target_price = self.or_low - random.uniform(2, 5)
            direction = -1

        # Generate bars moving toward breakout
        for minute in range(10):
            bar_time = current_time + timedelta(minutes=minute)

            # Gradually move price toward target with some noise
            price_move = (target_price - self.current_price) * 0.3
            next_price = self.current_price + price_move + random.uniform(-0.5, 0.5)

            # Higher volume on breakout bar
            if minute == 3:  # Breakout bar
                volume = random.randint(2000, 3000)  # High volume
                self.logger.info(f"  >>> BREAKOUT BAR <<<")
            else:
                volume = random.randint(500, 1200)

            bar = Bar(
                timestamp=bar_time,
                open_price=self.current_price,
                high=max(next_price, self.current_price) + random.uniform(0, 0.5),
                low=min(next_price, self.current_price) - random.uniform(0, 0.5),
                close=next_price,
                volume=volume
            )

            self.current_price = next_price
            self.bot.on_bar(bar)
            self.logger.info(
                f"  {bar_time.strftime('%H:%M')} - "
                f"O:{bar.open:.2f} H:{bar.high:.2f} L:{bar.low:.2f} C:{bar.close:.2f} V:{bar.volume}"
            )

    def generate_profit_target_move(self, current_time: datetime, target_price: float):
        """Generate bars moving toward profit target."""
        self.logger.info(f"\n{'='*60}")
        self.logger.info(f"MOVING TOWARD TARGET: {target_price:.2f}")
        self.logger.info(f"{'='*60}")

        for minute in range(15):
            bar_time = current_time + timedelta(minutes=minute)

            # Move toward target with some realistic fluctuation
            price_move = (target_price - self.current_price) * 0.2
            next_price = self.current_price + price_move + random.uniform(-0.3, 0.3)

            bar = Bar(
                timestamp=bar_time,
                open_price=self.current_price,
                high=max(next_price, self.current_price) + random.uniform(0, 0.5),
                low=min(next_price, self.current_price) - random.uniform(0, 0.5),
                close=next_price,
                volume=random.randint(500, 1200)
            )

            self.current_price = next_price
            self.bot.on_bar(bar)
            self.logger.info(
                f"  {bar_time.strftime('%H:%M')} - "
                f"O:{bar.open:.2f} H:{bar.high:.2f} L:{bar.low:.2f} C:{bar.close:.2f} V:{bar.volume}"
            )

            # Check if target hit
            position_info = self.bot.order_manager.get_position_info()
            if position_info and 'target_price' in position_info:
                if abs(next_price - position_info['target_price']) < 0.5:
                    self.logger.info(f"  >>> TARGET REACHED <<<")
                    break

    def run_full_day_simulation(self):
        """Run a full day simulation."""
        self.logger.info("\n" + "="*80)
        self.logger.info("STARTING FULL DAY SIMULATION")
        self.logger.info("="*80)

        # Start time: 9:30 AM ET
        current_time = datetime.now(self.timezone).replace(
            hour=9, minute=30, second=0, microsecond=0
        )

        # 1. Generate opening range (5 minutes)
        self.generate_opening_range(current_time, or_minutes=5)
        current_time += timedelta(minutes=5)

        time.sleep(2)  # Pause for readability

        # 2. Generate breakout (random direction)
        breakout_type = random.choice(["bullish", "bearish"])
        self.generate_breakout_scenario(current_time, breakout_type)
        current_time += timedelta(minutes=10)

        time.sleep(2)

        # 3. Get target from position
        position_info = self.bot.order_manager.get_position_info()
        if position_info and 'target_price' in position_info:
            target_price = position_info['target_price']
            self.generate_profit_target_move(current_time, target_price)

        time.sleep(2)

        # 4. Print final statistics
        self.logger.info("\n" + "="*80)
        self.logger.info("SIMULATION COMPLETE - FINAL STATISTICS")
        self.logger.info("="*80)

        stats = self.bot.broker.get_statistics()
        for key, value in stats.items():
            if isinstance(value, float):
                self.logger.info(f"{key}: {value:.2f}")
            else:
                self.logger.info(f"{key}: {value}")

        self.logger.info("\nTrade History:")
        for i, trade in enumerate(self.bot.broker.get_trade_history(), 1):
            self.logger.info(
                f"  Trade {i}: {trade['side'].upper()} @ {trade['entry_price']:.2f} -> "
                f"{trade['exit_price']:.2f}, P&L: ${trade['pnl']:.2f}"
            )


def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully."""
    print("\n\nShutting down simulator...")
    if 'bot' in globals():
        globals()['bot'].stop()
    sys.exit(0)


def main():
    """Main function to run the simulator."""
    signal.signal(signal.SIGINT, signal_handler)

    try:
        # Load configuration
        config = Config("config.yaml")

        # Create and start the bot
        bot = globals()['bot'] = TradingBot(config)
        bot.start()

        # Create and run simulator
        simulator = MarketSimulator(bot, start_price=5000.0)
        simulator.run_full_day_simulation()

        # Keep bot running to see final state
        print("\nSimulation complete. Press Ctrl+C to exit.")
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
