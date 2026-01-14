"""News filter to avoid trading on high-impact news days."""
from datetime import datetime, date
from typing import List, Set
import pytz

from .logger import Logger


class NewsFilter:
    """Filter to avoid trading on news days."""

    # Major economic news releases that typically affect ES futures
    HIGH_IMPACT_NEWS = [
        "FOMC Meeting",
        "NFP",  # Non-Farm Payrolls
        "CPI",  # Consumer Price Index
        "FOMC Minutes",
        "GDP",
        "Interest Rate Decision",
        "Employment Report",
        "Retail Sales"
    ]

    def __init__(self, enabled: bool = True, timezone: str = "America/New_York"):
        self.enabled = enabled
        self.timezone = pytz.timezone(timezone)
        self.logger = Logger.get_logger()

        # Predefined news days for 2026 (should be updated regularly)
        # Format: (month, day, description)
        self.known_news_days_2026 = [
            # FOMC Meetings 2026
            (1, 28, "FOMC Meeting"),
            (1, 29, "FOMC Meeting"),
            (3, 17, "FOMC Meeting"),
            (3, 18, "FOMC Meeting"),
            (4, 28, "FOMC Meeting"),
            (4, 29, "FOMC Meeting"),
            (6, 16, "FOMC Meeting"),
            (6, 17, "FOMC Meeting"),
            (7, 28, "FOMC Meeting"),
            (7, 29, "FOMC Meeting"),
            (9, 22, "FOMC Meeting"),
            (9, 23, "FOMC Meeting"),
            (11, 3, "FOMC Meeting"),
            (11, 4, "FOMC Meeting"),
            (12, 15, "FOMC Meeting"),
            (12, 16, "FOMC Meeting"),

            # NFP Days (First Friday of each month, typically)
            (1, 9, "NFP"),
            (2, 6, "NFP"),
            (3, 6, "NFP"),
            (4, 3, "NFP"),
            (5, 8, "NFP"),
            (6, 5, "NFP"),
            (7, 3, "NFP"),
            (8, 7, "NFP"),
            (9, 4, "NFP"),
            (10, 2, "NFP"),
            (11, 6, "NFP"),
            (12, 4, "NFP"),
        ]

        self.excluded_dates: Set[date] = self._build_excluded_dates()

    def _build_excluded_dates(self) -> Set[date]:
        """Build set of excluded dates from known news days."""
        excluded = set()
        current_year = datetime.now().year

        if current_year == 2026:
            for month, day, _ in self.known_news_days_2026:
                excluded.add(date(2026, month, day))

        return excluded

    def is_trading_allowed(self, current_date: date) -> tuple[bool, str]:
        """
        Check if trading is allowed on the given date.

        Args:
            current_date: Date to check

        Returns:
            Tuple of (is_allowed, reason)
        """
        if not self.enabled:
            return True, "News filter disabled"

        if current_date in self.excluded_dates:
            # Find the news event
            for month, day, description in self.known_news_days_2026:
                if current_date == date(current_date.year, month, day):
                    reason = f"High-impact news day: {description}"
                    self.logger.warning(f"Trading not allowed: {reason}")
                    return False, reason

        return True, "No major news events"

    def add_news_date(self, news_date: date, description: str = "High-impact news"):
        """
        Add a custom news date to avoid.

        Args:
            news_date: Date to exclude
            description: Description of the news event
        """
        self.excluded_dates.add(news_date)
        self.logger.info(f"Added news date: {news_date} - {description}")

    def remove_news_date(self, news_date: date):
        """
        Remove a news date from exclusions.

        Args:
            news_date: Date to remove from exclusions
        """
        if news_date in self.excluded_dates:
            self.excluded_dates.remove(news_date)
            self.logger.info(f"Removed news date: {news_date}")

    def get_next_news_date(self, current_date: date) -> tuple[date, str]:
        """
        Get the next upcoming news date.

        Args:
            current_date: Current date

        Returns:
            Tuple of (next_news_date, description)
        """
        future_dates = [d for d in self.excluded_dates if d > current_date]

        if not future_dates:
            return None, ""

        next_date = min(future_dates)

        # Find description
        for month, day, description in self.known_news_days_2026:
            if next_date == date(next_date.year, month, day):
                return next_date, description

        return next_date, "High-impact news"

    def get_excluded_dates(self) -> List[date]:
        """Get list of all excluded dates."""
        return sorted(list(self.excluded_dates))

    def log_status(self, current_date: date):
        """Log news filter status."""
        allowed, reason = self.is_trading_allowed(current_date)

        if allowed:
            next_date, description = self.get_next_news_date(current_date)
            if next_date:
                self.logger.info(
                    f"News Filter: Trading allowed today. "
                    f"Next news day: {next_date} ({description})"
                )
            else:
                self.logger.info("News Filter: Trading allowed today. No upcoming news days.")
        else:
            self.logger.warning(f"News Filter: {reason}")
