#!/usr/bin/env python3
"""Main entry point for the ES Futures Trading Bot."""
import sys
import signal
from datetime import datetime, timedelta
import pytz

from src.utils.config import Config
from src.utils.logger import Logger
from src.bot.trading_bot import TradingBot
from src.data.market_data import Bar


def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully."""
    print("\n\nShutting down gracefully...")
    if 'bot' in globals():
        bot.stop()
    sys.exit(0)


def main():
    """Main function to run the trading bot."""
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)

    try:
        # Load configuration
        config = Config("config.yaml")
        logger = Logger.get_logger(log_file=config.log_file, level=config.log_level)

        # Create and start the bot
        bot = globals()['bot'] = TradingBot(config)
        bot.start()

        logger.info("\nBot is now running in simulation mode.")
        logger.info("In a live environment, this would connect to your broker's data feed.")
        logger.info("For testing, run the simulator: python simulator.py")
        logger.info("\nPress Ctrl+C to stop the bot.\n")

        # Keep the bot running
        while bot.is_running:
            import time
            time.sleep(1)

    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please ensure config.yaml exists in the project root.")
        sys.exit(1)
    except Exception as e:
        print(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
