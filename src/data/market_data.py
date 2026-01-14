"""Market data handler for ES futures."""
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import pandas as pd
import pytz
from collections import deque


class Bar:
    """Represents a single price bar."""

    def __init__(self, timestamp: datetime, open_price: float, high: float,
                 low: float, close: float, volume: int):
        self.timestamp = timestamp
        self.open = open_price
        self.high = high
        self.low = low
        self.close = close
        self.volume = volume

    def __repr__(self):
        return (f"Bar(timestamp={self.timestamp}, open={self.open}, "
                f"high={self.high}, low={self.low}, close={self.close}, "
                f"volume={self.volume})")


class MarketDataHandler:
    """Handles market data for ES futures."""

    def __init__(self, symbol: str = "ES", timezone: str = "America/New_York"):
        self.symbol = symbol
        self.timezone = pytz.timezone(timezone)
        self.bars: deque = deque(maxlen=1000)  # Store last 1000 bars
        self.current_bar: Optional[Bar] = None

    def add_bar(self, timestamp: datetime, open_price: float, high: float,
                low: float, close: float, volume: int):
        """Add a new bar to the data handler."""
        if timestamp.tzinfo is None:
            timestamp = self.timezone.localize(timestamp)

        bar = Bar(timestamp, open_price, high, low, close, volume)
        self.bars.append(bar)
        self.current_bar = bar

    def get_bars(self, start_time: Optional[datetime] = None,
                 end_time: Optional[datetime] = None) -> List[Bar]:
        """Get bars within a time range."""
        if not self.bars:
            return []

        filtered_bars = list(self.bars)

        if start_time:
            if start_time.tzinfo is None:
                start_time = self.timezone.localize(start_time)
            filtered_bars = [b for b in filtered_bars if b.timestamp >= start_time]

        if end_time:
            if end_time.tzinfo is None:
                end_time = self.timezone.localize(end_time)
            filtered_bars = [b for b in filtered_bars if b.timestamp <= end_time]

        return filtered_bars

    def get_bars_since(self, minutes: int) -> List[Bar]:
        """Get bars from the last N minutes."""
        if not self.current_bar:
            return []

        start_time = self.current_bar.timestamp - timedelta(minutes=minutes)
        return self.get_bars(start_time=start_time)

    def get_latest_bar(self) -> Optional[Bar]:
        """Get the most recent bar."""
        return self.current_bar

    def get_average_volume(self, lookback_bars: int = 20) -> float:
        """Calculate average volume over the last N bars."""
        if not self.bars:
            return 0.0

        recent_bars = list(self.bars)[-lookback_bars:]
        if not recent_bars:
            return 0.0

        total_volume = sum(bar.volume for bar in recent_bars)
        return total_volume / len(recent_bars)

    def get_high_low_range(self, start_time: datetime, end_time: datetime) -> Tuple[float, float]:
        """Get the high and low within a time range."""
        bars = self.get_bars(start_time, end_time)

        if not bars:
            return (0.0, 0.0)

        high = max(bar.high for bar in bars)
        low = min(bar.low for bar in bars)

        return (high, low)

    def get_total_volume(self, start_time: datetime, end_time: datetime) -> int:
        """Get total volume within a time range."""
        bars = self.get_bars(start_time, end_time)
        return sum(bar.volume for bar in bars)

    def to_dataframe(self) -> pd.DataFrame:
        """Convert bars to pandas DataFrame."""
        if not self.bars:
            return pd.DataFrame()

        data = {
            'timestamp': [bar.timestamp for bar in self.bars],
            'open': [bar.open for bar in self.bars],
            'high': [bar.high for bar in self.bars],
            'low': [bar.low for bar in self.bars],
            'close': [bar.close for bar in self.bars],
            'volume': [bar.volume for bar in self.bars]
        }

        df = pd.DataFrame(data)
        df.set_index('timestamp', inplace=True)
        return df

    def clear(self):
        """Clear all stored bars."""
        self.bars.clear()
        self.current_bar = None
