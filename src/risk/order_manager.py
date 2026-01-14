"""Order management system."""
from typing import Optional, Dict
from datetime import datetime

from ..data.broker_interface import (
    BrokerInterface, Order, OrderSide, OrderType, OrderStatus
)
from ..strategy.breakout_detector import BreakoutDirection, BreakoutSignal
from ..strategy.opening_range import OpeningRange
from ..utils.logger import Logger


class OrderManager:
    """Manages order creation and execution."""

    def __init__(self, broker: BrokerInterface, opening_range: OpeningRange,
                 symbol: str = "ES", point_value: float = 50.0):
        self.broker = broker
        self.opening_range = opening_range
        self.symbol = symbol
        self.point_value = point_value
        self.logger = Logger.get_logger()

        self.entry_order: Optional[Order] = None
        self.stop_order: Optional[Order] = None
        self.target_order: Optional[Order] = None

        self.entry_price: Optional[float] = None
        self.stop_price: Optional[float] = None
        self.target_price: Optional[float] = None

    def create_breakout_orders(self, breakout_signal: BreakoutSignal,
                               quantity: int, risk_reward_ratio: float = 2.0) -> bool:
        """
        Create entry, stop, and target orders based on breakout signal.

        Args:
            breakout_signal: The breakout signal
            quantity: Number of contracts
            risk_reward_ratio: Risk/reward ratio for target

        Returns:
            True if orders were created successfully
        """
        if breakout_signal.direction == BreakoutDirection.BULLISH:
            return self._create_long_orders(breakout_signal, quantity, risk_reward_ratio)
        elif breakout_signal.direction == BreakoutDirection.BEARISH:
            return self._create_short_orders(breakout_signal, quantity, risk_reward_ratio)
        else:
            self.logger.warning("Invalid breakout direction")
            return False

    def _create_long_orders(self, signal: BreakoutSignal, quantity: int,
                           risk_reward_ratio: float) -> bool:
        """Create orders for a long (bullish) breakout."""
        # Entry: Market order to go long
        entry_order = Order(
            symbol=self.symbol,
            side=OrderSide.BUY,
            quantity=quantity,
            order_type=OrderType.MARKET
        )

        if not self.broker.submit_order(entry_order):
            self.logger.error("Failed to submit entry order")
            return False

        self.entry_order = entry_order
        self.entry_price = signal.price

        # Stop: Set at OR low (opposite extreme)
        self.stop_price = self.opening_range.get_low()
        risk = self.entry_price - self.stop_price

        self.logger.info(
            f"Long entry at {self.entry_price:.2f}, stop at {self.stop_price:.2f}, "
            f"risk: {risk:.2f} points (${risk * self.point_value:.2f})"
        )

        # Target: Based on risk/reward ratio
        self.target_price = self.entry_price + (risk * risk_reward_ratio)

        self.logger.info(
            f"Target set at {self.target_price:.2f}, "
            f"reward: {risk * risk_reward_ratio:.2f} points "
            f"(${risk * risk_reward_ratio * self.point_value:.2f})"
        )

        return True

    def _create_short_orders(self, signal: BreakoutSignal, quantity: int,
                            risk_reward_ratio: float) -> bool:
        """Create orders for a short (bearish) breakout."""
        # Entry: Market order to go short
        entry_order = Order(
            symbol=self.symbol,
            side=OrderSide.SELL,
            quantity=quantity,
            order_type=OrderType.MARKET
        )

        if not self.broker.submit_order(entry_order):
            self.logger.error("Failed to submit entry order")
            return False

        self.entry_order = entry_order
        self.entry_price = signal.price

        # Stop: Set at OR high (opposite extreme)
        self.stop_price = self.opening_range.get_high()
        risk = self.stop_price - self.entry_price

        self.logger.info(
            f"Short entry at {self.entry_price:.2f}, stop at {self.stop_price:.2f}, "
            f"risk: {risk:.2f} points (${risk * self.point_value:.2f})"
        )

        # Target: Based on risk/reward ratio
        self.target_price = self.entry_price - (risk * risk_reward_ratio)

        self.logger.info(
            f"Target set at {self.target_price:.2f}, "
            f"reward: {risk * risk_reward_ratio:.2f} points "
            f"(${risk * risk_reward_ratio * self.point_value:.2f})"
        )

        return True

    def check_exit_conditions(self, current_price: float) -> Optional[str]:
        """
        Check if stop loss or target has been hit.

        Args:
            current_price: Current market price

        Returns:
            Exit reason if position should be closed, None otherwise
        """
        if not self.entry_order or not self.entry_price:
            return None

        # Check if entry order was filled
        if self.entry_order.status != OrderStatus.FILLED:
            return None

        # For long positions
        if self.entry_order.side == OrderSide.BUY:
            if current_price <= self.stop_price:
                return "stop_loss"
            elif current_price >= self.target_price:
                return "target"

        # For short positions
        elif self.entry_order.side == OrderSide.SELL:
            if current_price >= self.stop_price:
                return "stop_loss"
            elif current_price <= self.target_price:
                return "target"

        return None

    def close_position(self, reason: str) -> bool:
        """
        Close the current position.

        Args:
            reason: Reason for closing (stop_loss, target, manual, etc.)

        Returns:
            True if position was closed successfully
        """
        if not self.entry_order:
            self.logger.warning("No open position to close")
            return False

        # Create exit order (opposite side of entry)
        exit_side = OrderSide.SELL if self.entry_order.side == OrderSide.BUY else OrderSide.BUY

        exit_order = Order(
            symbol=self.symbol,
            side=exit_side,
            quantity=self.entry_order.quantity,
            order_type=OrderType.MARKET
        )

        if not self.broker.submit_order(exit_order):
            self.logger.error("Failed to submit exit order")
            return False

        self.logger.info(f"Position closed: {reason}")

        # Reset orders
        self.entry_order = None
        self.stop_order = None
        self.target_order = None
        self.entry_price = None
        self.stop_price = None
        self.target_price = None

        return True

    def has_open_position(self) -> bool:
        """Check if there is an open position."""
        if not self.entry_order:
            return False
        return self.entry_order.status == OrderStatus.FILLED

    def get_position_info(self) -> Dict:
        """Get information about the current position."""
        if not self.has_open_position():
            return {}

        return {
            'symbol': self.symbol,
            'side': self.entry_order.side.value,
            'quantity': self.entry_order.quantity,
            'entry_price': self.entry_price,
            'stop_price': self.stop_price,
            'target_price': self.target_price,
            'risk_points': abs(self.entry_price - self.stop_price),
            'reward_points': abs(self.target_price - self.entry_price)
        }

    def cancel_all_orders(self):
        """Cancel all pending orders."""
        for order in [self.entry_order, self.stop_order, self.target_order]:
            if order and order.order_id:
                self.broker.cancel_order(order.order_id)

        self.logger.info("All orders cancelled")
