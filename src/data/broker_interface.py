"""Broker interface for order execution."""
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, List, Dict
from enum import Enum


class OrderSide(Enum):
    """Order side enumeration."""
    BUY = "buy"
    SELL = "sell"


class OrderType(Enum):
    """Order type enumeration."""
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"


class OrderStatus(Enum):
    """Order status enumeration."""
    PENDING = "pending"
    SUBMITTED = "submitted"
    FILLED = "filled"
    PARTIALLY_FILLED = "partially_filled"
    CANCELLED = "cancelled"
    REJECTED = "rejected"


class Order:
    """Represents a trading order."""

    def __init__(self, symbol: str, side: OrderSide, quantity: int,
                 order_type: OrderType, price: Optional[float] = None,
                 stop_price: Optional[float] = None):
        self.order_id: Optional[str] = None
        self.symbol = symbol
        self.side = side
        self.quantity = quantity
        self.order_type = order_type
        self.price = price
        self.stop_price = stop_price
        self.status = OrderStatus.PENDING
        self.filled_quantity = 0
        self.filled_price: Optional[float] = None
        self.timestamp = datetime.now()

    def __repr__(self):
        return (f"Order(id={self.order_id}, symbol={self.symbol}, "
                f"side={self.side.value}, qty={self.quantity}, "
                f"type={self.order_type.value}, status={self.status.value})")


class Position:
    """Represents a trading position."""

    def __init__(self, symbol: str, quantity: int, entry_price: float,
                 side: OrderSide):
        self.symbol = symbol
        self.quantity = quantity
        self.entry_price = entry_price
        self.side = side
        self.entry_time = datetime.now()
        self.unrealized_pnl = 0.0

    def update_pnl(self, current_price: float, point_value: float = 50.0):
        """Update unrealized P&L based on current price."""
        if self.side == OrderSide.BUY:
            self.unrealized_pnl = (current_price - self.entry_price) * self.quantity * point_value
        else:
            self.unrealized_pnl = (self.entry_price - current_price) * self.quantity * point_value

    def __repr__(self):
        return (f"Position(symbol={self.symbol}, qty={self.quantity}, "
                f"entry={self.entry_price}, side={self.side.value}, "
                f"pnl={self.unrealized_pnl:.2f})")


class BrokerInterface(ABC):
    """Abstract base class for broker implementations."""

    @abstractmethod
    def connect(self) -> bool:
        """Connect to the broker."""
        pass

    @abstractmethod
    def disconnect(self):
        """Disconnect from the broker."""
        pass

    @abstractmethod
    def submit_order(self, order: Order) -> bool:
        """Submit an order to the broker."""
        pass

    @abstractmethod
    def cancel_order(self, order_id: str) -> bool:
        """Cancel an order."""
        pass

    @abstractmethod
    def get_order_status(self, order_id: str) -> OrderStatus:
        """Get the status of an order."""
        pass

    @abstractmethod
    def get_position(self, symbol: str) -> Optional[Position]:
        """Get current position for a symbol."""
        pass

    @abstractmethod
    def get_all_positions(self) -> List[Position]:
        """Get all open positions."""
        pass

    @abstractmethod
    def get_account_balance(self) -> float:
        """Get account balance."""
        pass

    @abstractmethod
    def subscribe_market_data(self, symbol: str):
        """Subscribe to market data for a symbol."""
        pass

    @abstractmethod
    def unsubscribe_market_data(self, symbol: str):
        """Unsubscribe from market data for a symbol."""
        pass
