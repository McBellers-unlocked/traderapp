# ES Futures Opening Range Breakout Trading Bot

An automated trading bot for E-mini S&P 500 (ES) futures that implements an opening range breakout strategy with volume confirmation, risk management, and news filtering.

## 🎯 Strategy Overview

**Market**: E-mini S&P 500 Futures (ES)
**Strategy**: Opening Range Breakout
**Time Window**: 9:30-10:30 AM ET (NYSE open)
**Point Value**: $50 per point

### How It Works

1. **Opening Range Calculation**: Defines the high/low in the first 5-15 minutes after 9:30 AM ET market open
2. **Breakout Detection**:
   - **Long Signal**: Price breaks above OR high with volume confirmation
   - **Short Signal**: Price breaks below OR low with volume confirmation
3. **Entry**: Market order on confirmed breakout
4. **Stop Loss**: Set at opposite OR extreme (OR low for longs, OR high for shorts)
5. **Target**: Based on risk/reward ratio (default 2:1)
6. **Filters**: Avoids trading on major news days (FOMC, NFP, etc.)

## 📁 Project Structure

```
traderapp/
├── config.yaml              # Strategy configuration
├── .env.example            # Environment variables template
├── requirements.txt        # Python dependencies
├── main.py                 # Main entry point
├── simulator.py           # Market data simulator for testing
├── src/
│   ├── bot/
│   │   └── trading_bot.py      # Main bot orchestrator
│   ├── data/
│   │   ├── market_data.py      # Market data handler
│   │   ├── broker_interface.py # Broker abstraction
│   │   └── paper_broker.py     # Paper trading implementation
│   ├── strategy/
│   │   ├── opening_range.py    # Opening range calculator
│   │   └── breakout_detector.py # Breakout detection logic
│   ├── risk/
│   │   ├── order_manager.py    # Order management
│   │   └── risk_manager.py     # Risk management
│   └── utils/
│       ├── config.py           # Configuration management
│       ├── logger.py           # Logging system
│       └── news_filter.py      # News day filtering
├── logs/                   # Trading logs
└── tests/                  # Unit tests

```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- pip package manager
- (Optional) Broker API credentials for live trading

### Installation

1. **Clone the repository**:
```bash
cd traderapp
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your settings
```

5. **Review configuration**:
```bash
# Edit config.yaml to adjust strategy parameters
```

### Running the Simulator

Test the bot with simulated market data:

```bash
python simulator.py
```

This will simulate a full trading day with:
- Opening range formation
- Breakout scenario (random bullish/bearish)
- Position management through to target/stop
- Final statistics and trade history

### Running the Bot (Paper Trading)

```bash
python main.py
```

**Note**: By default, the bot runs in paper trading mode. For live trading, you'll need to:
1. Add broker API credentials to `.env`
2. Implement real-time data feed connection
3. Test thoroughly in paper mode first

## ⚙️ Configuration

### Strategy Parameters (`config.yaml`)

```yaml
strategy:
  opening_range_minutes: 5        # OR period: 5-15 minutes
  trading_window:
    start: "09:30"                # Market open time
    end: "10:30"                  # Trading window close

  entry_rules:
    volume_confirmation: true     # Require volume spike
    volume_multiplier: 1.5        # Volume must be 1.5x average
    min_breakout_points: 0.25     # Min distance from OR

  exit_rules:
    risk_reward_ratio: 2.0        # Target at 2x risk

risk_management:
  max_position_size: 1            # Max contracts
  max_daily_loss: 500             # Max loss per day ($)
  max_daily_trades: 3             # Max trades per day

filters:
  avoid_news_days: true           # Skip major news days
```

### Risk Management

The bot includes comprehensive risk controls:

- **Position Sizing**: Automatically calculates based on account balance and risk per trade
- **Daily Loss Limit**: Stops trading if daily loss exceeds threshold
- **Daily Trade Limit**: Prevents overtrading
- **Stop Loss**: Always placed at opposite OR extreme
- **News Filter**: Avoids trading on FOMC, NFP, and other high-impact days

## 📊 Features

### Core Features

✅ **Opening Range Calculation**: Automated OR detection after market open
✅ **Volume Confirmation**: Validates breakouts with volume analysis
✅ **Automated Entry/Exit**: Market orders with stop and target management
✅ **Risk Management**: Position sizing, daily limits, stop losses
✅ **News Filtering**: Avoids trading on major economic news days
✅ **Paper Trading**: Built-in paper broker for safe testing
✅ **Comprehensive Logging**: Detailed logs of all trading activity
✅ **Statistics Tracking**: Win rate, P&L, trade history

### Technical Features

- Clean, modular architecture
- Configurable via YAML and environment variables
- Timezone-aware (handles ET market hours)
- State machine for robust bot logic
- Extensible broker interface (easily add real brokers)

## 🔧 Extending the Bot

### Adding a Real Broker

The bot uses an abstract `BrokerInterface`. To add support for a real broker:

1. Create a new file in `src/data/` (e.g., `alpaca_broker.py`)
2. Implement the `BrokerInterface` abstract methods
3. Update `trading_bot.py` to use your broker implementation

Example structure:
```python
from src.data.broker_interface import BrokerInterface

class AlpacaBroker(BrokerInterface):
    def connect(self) -> bool:
        # Implement connection logic
        pass

    def submit_order(self, order: Order) -> bool:
        # Implement order submission
        pass

    # ... implement other abstract methods
```

### Customizing the Strategy

Key files to modify:

- **`opening_range.py`**: Change OR calculation logic
- **`breakout_detector.py`**: Modify breakout conditions
- **`order_manager.py`**: Adjust entry/exit logic
- **`risk_manager.py`**: Update risk parameters

## 📈 Example Output

```
================================================================================
ES FUTURES OPENING RANGE BREAKOUT BOT
================================================================================
Bot started - Strategy: Opening Range Breakout
Symbol: ES
Opening Range: 5 minutes
Trading Window: 09:30 - 10:30
Risk/Reward Ratio: 2.0
Max Position Size: 1 contracts
Max Daily Loss: $500
================================================================================

09:35 - Opening Range calculated: High=5003.50, Low=4998.25, Range=5.25 points

09:42 - BULLISH BREAKOUT: Price 5004.00 broke above OR high 5003.50 with volume 2500

09:42 - Long entry at 5004.00, stop at 4998.25, risk: 5.75 points ($287.50)
09:42 - Target set at 5015.50, reward: 11.50 points ($575.00)

09:57 - EXIT SIGNAL: target
09:57 - Position closed: target

Trade Statistics:
  Total Trades: 1
  Winning Trades: 1
  Win Rate: 100.0%
  Total P&L: $575.00
```

## 🧪 Testing

Run the simulator to test the bot:

```bash
python simulator.py
```

The simulator will:
1. Generate realistic opening range bars
2. Simulate a breakout with volume confirmation
3. Move price toward target
4. Display full statistics and trade history

## ⚠️ Important Disclaimers

**THIS SOFTWARE IS FOR EDUCATIONAL PURPOSES ONLY**

- Futures trading involves substantial risk of loss
- Past performance does not guarantee future results
- Test thoroughly in paper trading before live trading
- Understand all risks before trading with real money
- This is not financial advice
- The authors are not responsible for any trading losses

## 🛡️ Safety Features

- Paper trading mode by default
- Automatic daily loss limits
- Maximum position size enforcement
- News day filtering
- Comprehensive logging for audit trail
- Graceful shutdown (Ctrl+C)

## 📝 Logging

All trading activity is logged to `logs/trading_bot.log`:

- Opening range calculations
- Breakout signals
- Order submissions and fills
- Position management
- Risk checks
- Daily statistics

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional broker integrations (Interactive Brokers, TDAmeritrade, etc.)
- Real-time data feed connections
- Backtesting framework
- Additional strategy variations
- Performance optimization
- Web dashboard for monitoring

## 📄 License

MIT License - see LICENSE file for details

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Review logs in `logs/trading_bot.log`
- Check configuration in `config.yaml` and `.env`

## 🎓 Learning Resources

To understand the strategy better:

- **Opening Range Breakout**: Classic momentum strategy exploiting early market dynamics
- **Volume Confirmation**: Validates breakout strength to reduce false signals
- **Risk/Reward Ratio**: Ensures favorable odds (target 2x the risk)
- **News Filtering**: Avoids unpredictable volatility from major announcements

## 🔄 Version History

**v1.0.0** - Initial release
- Opening range breakout strategy
- Volume confirmation
- Risk management
- News filtering
- Paper trading support
- Market simulator

---

**Happy Trading! Remember: Test first, trade second. 🚀**