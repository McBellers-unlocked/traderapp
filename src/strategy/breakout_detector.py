"""Breakout detection logic."""
from datetime import datetime
from typing import Optional
from enum import Enum

from ..data.market_data import MarketDataHandler, Bar
from .opening_range import OpeningRange
from ..utils.logger import Logger


class BreakoutDirection(Enum):
    """Breakout direction enumeration."""
    NONE = "none"
    BULLISH = "bullish"
    BEARISH = "bearish"


class BreakoutSignal:
    """Represents a breakout signal."""

    def __init__(self, direction: BreakoutDirection, price: float,
                 timestamp: datetime, volume: int):
        self.direction = direction
        self.price = price
        self.timestamp = timestamp
        self.volume = volume

    def __repr__(self):
        return (f"BreakoutSignal(direction={self.direction.value}, "
                f"price={self.price:.2f}, volume={self.volume})")


class BreakoutDetector:
    """Detects opening range breakouts with volume confirmation."""

    def __init__(self, market_data: MarketDataHandler, opening_range: OpeningRange,
                 min_breakout_points: float = 0.25, volume_multiplier: float = 1.5,
                 volume_lookback: int = 20):
        self.market_data = market_data
        self.opening_range = opening_range
        self.min_breakout_points = min_breakout_points
        self.volume_multiplier = volume_multiplier
        self.volume_lookback = volume_lookback
        self.logger = Logger.get_logger()

        self.last_breakout: Optional[BreakoutSignal] = None
        self.breakout_occurred = False

    def check_breakout(self, current_bar: Bar,
                      require_volume_confirmation: bool = True) -> Optional[BreakoutSignal]:
        """
        Check for opening range breakout.

        Args:
            current_bar: Current price bar
            require_volume_confirmation: Whether to require volume confirmation

        Returns:
            BreakoutSignal if breakout detected, None otherwise
        """
        if not self.opening_range.is_calculated:
            return None

        # Check if we already had a breakout
        if self.breakout_occurred:
            return None

        current_price = current_bar.close
        current_volume = current_bar.volume

        # Check for bullish breakout
        if self.opening_range.is_above_high(current_price, self.min_breakout_points):
            if require_volume_confirmation:
                if not self._confirm_volume(current_volume):
                    self.logger.debug(
                        f"Bullish breakout detected but volume insufficient: "
                        f"{current_volume} vs avg {self.market_data.get_average_volume(self.volume_lookback):.0f}"
                    )
                    return None

            signal = BreakoutSignal(
                direction=BreakoutDirection.BULLISH,
                price=current_price,
                timestamp=current_bar.timestamp,
                volume=current_volume
            )

            self.logger.info(
                f"BULLISH BREAKOUT: Price {current_price:.2f} broke above OR high "
                f"{self.opening_range.get_high():.2f} with volume {current_volume}"
            )

            self.breakout_occurred = True
            self.last_breakout = signal
            return signal

        # Check for bearish breakout
        elif self.opening_range.is_below_low(current_price, self.min_breakout_points):
            if require_volume_confirmation:
                if not self._confirm_volume(current_volume):
                    self.logger.debug(
                        f"Bearish breakout detected but volume insufficient: "
                        f"{current_volume} vs avg {self.market_data.get_average_volume(self.volume_lookback):.0f}"
                    )
                    return None

            signal = BreakoutSignal(
                direction=BreakoutDirection.BEARISH,
                price=current_price,
                timestamp=current_bar.timestamp,
                volume=current_volume
            )

            self.logger.info(
                f"BEARISH BREAKOUT: Price {current_price:.2f} broke below OR low "
                f"{self.opening_range.get_low():.2f} with volume {current_volume}"
            )

            self.breakout_occurred = True
            self.last_breakout = signal
            return signal

        return None

    def _confirm_volume(self, current_volume: int) -> bool:
        """
        Confirm if volume is sufficient for breakout.

        Args:
            current_volume: Current bar volume

        Returns:
            True if volume exceeds threshold
        """
        avg_volume = self.market_data.get_average_volume(self.volume_lookback)

        if avg_volume == 0:
            self.logger.warning("No historical volume data available")
            return True  # Allow breakout if no historical data

        required_volume = avg_volume * self.volume_multiplier
        return current_volume >= required_volume

    def reset(self):
        """Reset breakout detector for a new day."""
        self.last_breakout = None
        self.breakout_occurred = False
        self.logger.info("Breakout detector reset")

    def has_breakout_occurred(self) -> bool:
        """Check if a breakout has already occurred."""
        return self.breakout_occurred

    def get_last_breakout(self) -> Optional[BreakoutSignal]:
        """Get the last detected breakout signal."""
        return self.last_breakout
