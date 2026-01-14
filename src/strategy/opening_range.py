"""Opening Range calculation and management."""
from datetime import datetime, time, timedelta
from typing import Optional, Tuple
import pytz

from ..data.market_data import MarketDataHandler
from ..utils.logger import Logger


class OpeningRange:
    """Manages opening range calculation and tracking."""

    def __init__(self, market_data: MarketDataHandler, or_minutes: int = 5,
                 timezone: str = "America/New_York"):
        self.market_data = market_data
        self.or_minutes = or_minutes
        self.timezone = pytz.timezone(timezone)
        self.logger = Logger.get_logger()

        self.or_high: Optional[float] = None
        self.or_low: Optional[float] = None
        self.or_start_time: Optional[datetime] = None
        self.or_end_time: Optional[datetime] = None
        self.is_calculated = False

    def calculate(self, current_time: datetime) -> bool:
        """
        Calculate the opening range.

        Args:
            current_time: Current time

        Returns:
            True if opening range was calculated successfully
        """
        if self.is_calculated:
            return True

        # Get market open time (9:30 AM ET)
        market_open = self._get_market_open_time(current_time)

        if current_time < market_open:
            self.logger.debug("Market not yet open")
            return False

        # Calculate OR end time
        or_end = market_open + timedelta(minutes=self.or_minutes)

        if current_time < or_end:
            self.logger.debug(
                f"Still within opening range period (ends at {or_end.strftime('%H:%M:%S')})"
            )
            return False

        # Calculate high and low during opening range period
        self.or_start_time = market_open
        self.or_end_time = or_end

        high, low = self.market_data.get_high_low_range(market_open, or_end)

        if high == 0.0 or low == 0.0:
            self.logger.warning("No data available for opening range period")
            return False

        self.or_high = high
        self.or_low = low
        self.is_calculated = True

        self.logger.info(
            f"Opening Range calculated: High={self.or_high:.2f}, "
            f"Low={self.or_low:.2f}, Range={self.get_range():.2f} points"
        )

        return True

    def _get_market_open_time(self, current_time: datetime) -> datetime:
        """Get the market open time for the current day."""
        if current_time.tzinfo is None:
            current_time = self.timezone.localize(current_time)

        market_open = current_time.replace(
            hour=9, minute=30, second=0, microsecond=0
        )

        return market_open

    def get_range(self) -> float:
        """Get the opening range size in points."""
        if not self.is_calculated:
            return 0.0
        return self.or_high - self.or_low

    def get_high(self) -> Optional[float]:
        """Get the opening range high."""
        return self.or_high

    def get_low(self) -> Optional[float]:
        """Get the opening range low."""
        return self.or_low

    def get_midpoint(self) -> Optional[float]:
        """Get the opening range midpoint."""
        if not self.is_calculated:
            return None
        return (self.or_high + self.or_low) / 2

    def is_above_high(self, price: float, buffer: float = 0.0) -> bool:
        """
        Check if price is above OR high.

        Args:
            price: Current price
            buffer: Minimum distance above OR high

        Returns:
            True if price is above OR high + buffer
        """
        if not self.is_calculated:
            return False
        return price > (self.or_high + buffer)

    def is_below_low(self, price: float, buffer: float = 0.0) -> bool:
        """
        Check if price is below OR low.

        Args:
            price: Current price
            buffer: Minimum distance below OR low

        Returns:
            True if price is below OR low - buffer
        """
        if not self.is_calculated:
            return False
        return price < (self.or_low - buffer)

    def reset(self):
        """Reset the opening range for a new day."""
        self.or_high = None
        self.or_low = None
        self.or_start_time = None
        self.or_end_time = None
        self.is_calculated = False
        self.logger.info("Opening range reset")

    def __repr__(self):
        if not self.is_calculated:
            return "OpeningRange(not calculated)"
        return (f"OpeningRange(high={self.or_high:.2f}, low={self.or_low:.2f}, "
                f"range={self.get_range():.2f})")
