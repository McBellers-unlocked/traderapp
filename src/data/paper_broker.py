"""Paper trading broker implementation for testing."""
from typing import Optional, List, Dict
import uuid
from datetime import datetime

from .broker_interface import (
    BrokerInterface, Order, Position, OrderSide,
    OrderType, OrderStatus
)
from ..utils.logger import Logger


class PaperBroker(BrokerInterface):
    """Paper trading broker for simulation and testing."""

    def __init__(self, initial_balance: float = 100000.0, point_value: float = 50.0):
        self.logger = Logger.get_logger()
        self.initial_balance = initial_balance
        self.balance = initial_balance
        self.point_value = point_value  # ES futures: $50 per point

        self.orders: Dict[str, Order] = {}
        self.positions: Dict[str, Position] = {}
        self.filled_orders: List[Order] = []
        self.trade_history: List[Dict] = []

        self.connected = False
        self.current_prices: Dict[str, float] = {}

        self.daily_pnl = 0.0
        self.total_trades = 0

    def connect(self) -> bool:
        """Connect to the paper broker."""
        self.logger.info("Connected to paper trading broker")
        self.connected = True
        return True

    def disconnect(self):
        """Disconnect from the paper broker."""
        self.logger.info("Disconnected from paper trading broker")
        self.connected = False

    def update_market_price(self, symbol: str, price: float):
        """Update current market price for a symbol."""
        self.current_prices[symbol] = price

        # Update P&L for open positions
        if symbol in self.positions:
            self.positions[symbol].update_pnl(price, self.point_value)

    def submit_order(self, order: Order) -> bool:
        """Submit an order to the paper broker."""
        if not self.connected:
            self.logger.error("Not connected to broker")
            return False

        order.order_id = str(uuid.uuid4())
        order.status = OrderStatus.SUBMITTED
        self.orders[order.order_id] = order

        self.logger.info(f"Order submitted: {order}")

        # For market orders, fill immediately at current price
        if order.order_type == OrderType.MARKET:
            self._fill_order(order)

        return True

    def _fill_order(self, order: Order):
        """Fill an order at current market price."""
        if order.symbol not in self.current_prices:
            self.logger.warning(f"No price data for {order.symbol}, cannot fill order")
            return

        fill_price = self.current_prices[order.symbol]
        order.filled_price = fill_price
        order.filled_quantity = order.quantity
        order.status = OrderStatus.FILLED
        self.filled_orders.append(order)

        # Update or create position
        self._update_position(order)

        self.logger.info(f"Order filled: {order.order_id} at price {fill_price}")
        self.total_trades += 1

    def _update_position(self, order: Order):
        """Update position based on filled order."""
        symbol = order.symbol

        if symbol in self.positions:
            position = self.positions[symbol]

            # Closing or reducing position
            if position.side != order.side:
                if order.quantity >= position.quantity:
                    # Close position completely
                    pnl = self._calculate_pnl(position, order.filled_price)
                    self.balance += pnl
                    self.daily_pnl += pnl

                    self.logger.info(
                        f"Position closed: {symbol}, P&L: ${pnl:.2f}"
                    )

                    self.trade_history.append({
                        'symbol': symbol,
                        'entry_price': position.entry_price,
                        'exit_price': order.filled_price,
                        'quantity': position.quantity,
                        'side': position.side.value,
                        'pnl': pnl,
                        'timestamp': datetime.now()
                    })

                    del self.positions[symbol]
                else:
                    # Reduce position
                    position.quantity -= order.quantity
            else:
                # Adding to position - average price
                total_quantity = position.quantity + order.quantity
                avg_price = (
                    (position.entry_price * position.quantity +
                     order.filled_price * order.quantity) / total_quantity
                )
                position.quantity = total_quantity
                position.entry_price = avg_price
        else:
            # Open new position
            position = Position(
                symbol=symbol,
                quantity=order.quantity,
                entry_price=order.filled_price,
                side=order.side
            )
            self.positions[symbol] = position
            self.logger.info(f"Position opened: {position}")

    def _calculate_pnl(self, position: Position, exit_price: float) -> float:
        """Calculate P&L for a position."""
        if position.side == OrderSide.BUY:
            pnl = (exit_price - position.entry_price) * position.quantity * self.point_value
        else:
            pnl = (position.entry_price - exit_price) * position.quantity * self.point_value
        return pnl

    def cancel_order(self, order_id: str) -> bool:
        """Cancel an order."""
        if order_id not in self.orders:
            self.logger.warning(f"Order {order_id} not found")
            return False

        order = self.orders[order_id]
        if order.status in [OrderStatus.FILLED, OrderStatus.CANCELLED]:
            self.logger.warning(f"Cannot cancel order {order_id} with status {order.status.value}")
            return False

        order.status = OrderStatus.CANCELLED
        self.logger.info(f"Order cancelled: {order_id}")
        return True

    def get_order_status(self, order_id: str) -> OrderStatus:
        """Get the status of an order."""
        if order_id in self.orders:
            return self.orders[order_id].status
        return OrderStatus.REJECTED

    def get_position(self, symbol: str) -> Optional[Position]:
        """Get current position for a symbol."""
        return self.positions.get(symbol)

    def get_all_positions(self) -> List[Position]:
        """Get all open positions."""
        return list(self.positions.values())

    def get_account_balance(self) -> float:
        """Get account balance."""
        return self.balance

    def get_daily_pnl(self) -> float:
        """Get daily P&L."""
        # Include unrealized P&L from open positions
        unrealized_pnl = sum(pos.unrealized_pnl for pos in self.positions.values())
        return self.daily_pnl + unrealized_pnl

    def get_total_trades(self) -> int:
        """Get total number of trades today."""
        return self.total_trades

    def reset_daily_stats(self):
        """Reset daily statistics."""
        self.daily_pnl = 0.0
        self.total_trades = 0
        self.logger.info("Daily stats reset")

    def subscribe_market_data(self, symbol: str):
        """Subscribe to market data for a symbol."""
        self.logger.info(f"Subscribed to market data: {symbol}")

    def unsubscribe_market_data(self, symbol: str):
        """Unsubscribe from market data for a symbol."""
        self.logger.info(f"Unsubscribed from market data: {symbol}")

    def get_trade_history(self) -> List[Dict]:
        """Get trade history."""
        return self.trade_history

    def get_statistics(self) -> Dict:
        """Get trading statistics."""
        if not self.trade_history:
            return {
                'total_trades': 0,
                'winning_trades': 0,
                'losing_trades': 0,
                'win_rate': 0.0,
                'total_pnl': 0.0,
                'average_win': 0.0,
                'average_loss': 0.0
            }

        winning_trades = [t for t in self.trade_history if t['pnl'] > 0]
        losing_trades = [t for t in self.trade_history if t['pnl'] <= 0]

        total_pnl = sum(t['pnl'] for t in self.trade_history)
        avg_win = sum(t['pnl'] for t in winning_trades) / len(winning_trades) if winning_trades else 0
        avg_loss = sum(t['pnl'] for t in losing_trades) / len(losing_trades) if losing_trades else 0

        return {
            'total_trades': len(self.trade_history),
            'winning_trades': len(winning_trades),
            'losing_trades': len(losing_trades),
            'win_rate': len(winning_trades) / len(self.trade_history) * 100,
            'total_pnl': total_pnl,
            'average_win': avg_win,
            'average_loss': avg_loss,
            'current_balance': self.balance
        }
