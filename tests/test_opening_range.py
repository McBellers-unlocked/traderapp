"""Tests for opening range calculation."""
import unittest
from datetime import datetime, time
import pytz

from src.data.market_data import MarketDataHandler
from src.strategy.opening_range import OpeningRange


class TestOpeningRange(unittest.TestCase):
    """Test cases for OpeningRange class."""

    def setUp(self):
        """Set up test fixtures."""
        self.market_data = MarketDataHandler("ES", "America/New_York")
        self.opening_range = OpeningRange(self.market_data, or_minutes=5)
        self.tz = pytz.timezone("America/New_York")

    def test_opening_range_calculation(self):
        """Test basic opening range calculation."""
        # Add bars for opening range period
        start_time = datetime(2026, 1, 15, 9, 30, 0)
        start_time = self.tz.localize(start_time)

        # Add 5 minute bars
        self.market_data.add_bar(start_time, 5000, 5005, 4998, 5003, 1000)
        self.market_data.add_bar(start_time.replace(minute=31), 5003, 5008, 5002, 5006, 1200)
        self.market_data.add_bar(start_time.replace(minute=32), 5006, 5010, 5004, 5009, 1100)
        self.market_data.add_bar(start_time.replace(minute=33), 5009, 5012, 5007, 5011, 900)
        self.market_data.add_bar(start_time.replace(minute=34), 5011, 5013, 5009, 5010, 1000)

        # Try to calculate at 9:36 (after OR period)
        current_time = start_time.replace(minute=36)
        result = self.opening_range.calculate(current_time)

        self.assertTrue(result)
        self.assertEqual(self.opening_range.get_high(), 5013)
        self.assertEqual(self.opening_range.get_low(), 4998)
        self.assertEqual(self.opening_range.get_range(), 15)

    def test_is_above_high(self):
        """Test checking if price is above OR high."""
        self.opening_range.or_high = 5010
        self.opening_range.or_low = 5000
        self.opening_range.is_calculated = True

        self.assertTrue(self.opening_range.is_above_high(5011))
        self.assertFalse(self.opening_range.is_above_high(5009))

    def test_is_below_low(self):
        """Test checking if price is below OR low."""
        self.opening_range.or_high = 5010
        self.opening_range.or_low = 5000
        self.opening_range.is_calculated = True

        self.assertTrue(self.opening_range.is_below_low(4999))
        self.assertFalse(self.opening_range.is_below_low(5001))


if __name__ == '__main__':
    unittest.main()
