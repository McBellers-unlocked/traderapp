"""Logging configuration for the trading bot."""
import logging
import sys
from pathlib import Path
from typing import Optional


class Logger:
    """Centralized logging system."""

    _instance: Optional[logging.Logger] = None

    @classmethod
    def get_logger(cls, name: str = "TradingBot", log_file: str = "logs/trading_bot.log",
                   level: str = "INFO") -> logging.Logger:
        """Get or create logger instance."""
        if cls._instance is None:
            cls._instance = cls._setup_logger(name, log_file, level)
        return cls._instance

    @classmethod
    def _setup_logger(cls, name: str, log_file: str, level: str) -> logging.Logger:
        """Set up logger with file and console handlers."""
        logger = logging.getLogger(name)
        logger.setLevel(getattr(logging, level.upper()))

        # Create logs directory if it doesn't exist
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        # File handler
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(file_formatter)

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, level.upper()))
        console_formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%H:%M:%S'
        )
        console_handler.setFormatter(console_formatter)

        # Add handlers
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger
