"""Configuration management for the trading bot."""
import os
import yaml
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv


class Config:
    """Centralized configuration management."""

    def __init__(self, config_path: str = "config.yaml"):
        """Initialize configuration from YAML file and environment variables."""
        load_dotenv()

        self.config_path = Path(config_path)
        self.config = self._load_config()
        self._validate_config()

    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Config file not found: {self.config_path}")

        with open(self.config_path, 'r') as f:
            return yaml.safe_load(f)

    def _validate_config(self):
        """Validate required configuration parameters."""
        required_sections = ['trading', 'strategy', 'risk_management']
        for section in required_sections:
            if section not in self.config:
                raise ValueError(f"Missing required config section: {section}")

    # Trading Configuration
    @property
    def symbol(self) -> str:
        return self.config['trading']['symbol']

    @property
    def contract_month(self) -> str:
        return self.config['trading']['contract_month']

    @property
    def exchange(self) -> str:
        return self.config['trading']['exchange']

    # Strategy Configuration
    @property
    def opening_range_minutes(self) -> int:
        return self.config['strategy']['opening_range_minutes']

    @property
    def trading_window_start(self) -> str:
        return self.config['strategy']['trading_window']['start']

    @property
    def trading_window_end(self) -> str:
        return self.config['strategy']['trading_window']['end']

    @property
    def timezone(self) -> str:
        return self.config['strategy']['trading_window']['timezone']

    @property
    def volume_confirmation(self) -> bool:
        return self.config['strategy']['entry_rules']['volume_confirmation']

    @property
    def volume_multiplier(self) -> float:
        return self.config['strategy']['entry_rules']['volume_multiplier']

    @property
    def min_breakout_points(self) -> float:
        return self.config['strategy']['entry_rules']['min_breakout_points']

    @property
    def risk_reward_ratio(self) -> float:
        return self.config['strategy']['exit_rules']['risk_reward_ratio']

    # Risk Management
    @property
    def max_position_size(self) -> int:
        return self.config['risk_management']['max_position_size']

    @property
    def max_daily_loss(self) -> float:
        return self.config['risk_management']['max_daily_loss']

    @property
    def max_daily_trades(self) -> int:
        return self.config['risk_management']['max_daily_trades']

    # Filters
    @property
    def avoid_news_days(self) -> bool:
        return self.config['filters']['avoid_news_days']

    # Broker Configuration from Environment
    @property
    def broker(self) -> str:
        return os.getenv('BROKER', 'paper')

    @property
    def alpaca_api_key(self) -> str:
        return os.getenv('ALPACA_API_KEY', '')

    @property
    def alpaca_secret_key(self) -> str:
        return os.getenv('ALPACA_SECRET_KEY', '')

    @property
    def alpaca_base_url(self) -> str:
        return os.getenv('ALPACA_BASE_URL', 'https://paper-api.alpaca.markets')

    # Logging
    @property
    def log_level(self) -> str:
        return os.getenv('LOG_LEVEL', self.config.get('logging', {}).get('level', 'INFO'))

    @property
    def log_file(self) -> str:
        return self.config.get('logging', {}).get('file', 'logs/trading_bot.log')

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key."""
        return self.config.get(key, default)
