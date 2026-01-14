# Setup Guide - ES Futures Trading Bot

This guide will walk you through setting up and running the ES futures opening range breakout trading bot.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Testing the Bot](#testing-the-bot)
5. [Going Live](#going-live)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Hardware
- CPU: Any modern processor (2+ cores recommended)
- RAM: 2GB minimum, 4GB recommended
- Storage: 500MB free space
- Internet: Stable connection for market data

### Software
- **Python**: Version 3.9 or higher
- **Operating System**: Linux, macOS, or Windows
- **Broker Account** (for live trading): Alpaca, Interactive Brokers, or compatible broker

## Installation Steps

### Step 1: Verify Python Installation

```bash
python --version
# or
python3 --version
```

If Python is not installed, download from [python.org](https://www.python.org/downloads/)

### Step 2: Set Up Project Directory

```bash
cd traderapp
```

### Step 3: Create Virtual Environment

**On Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### Step 4: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs all required packages:
- pandas (data manipulation)
- numpy (numerical operations)
- pytz (timezone handling)
- pyyaml (configuration files)
- python-dotenv (environment variables)
- And more...

### Step 5: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your preferred text editor:

```bash
nano .env  # or vim, code, notepad, etc.
```

**For Paper Trading** (testing), keep defaults:
```env
BROKER=paper
LOG_LEVEL=INFO
```

**For Live Trading** (after testing), add credentials:
```env
BROKER=alpaca
ALPACA_API_KEY=your_api_key_here
ALPACA_SECRET_KEY=your_secret_key_here
ALPACA_BASE_URL=https://paper-api.alpaca.markets  # Use paper first!
```

### Step 6: Review Configuration

Edit `config.yaml` to adjust strategy parameters:

```bash
nano config.yaml
```

**Key settings to review:**

```yaml
strategy:
  opening_range_minutes: 5      # Adjust between 5-15

risk_management:
  max_position_size: 1          # Start with 1 contract
  max_daily_loss: 500           # Set based on your risk tolerance
  max_daily_trades: 3           # Limit overtrading
```

### Step 7: Create Logs Directory

```bash
mkdir -p logs
```

## Configuration

### Understanding config.yaml

#### Trading Settings
```yaml
trading:
  symbol: ES                    # E-mini S&P 500
  contract_month: "202603"      # Front month contract (update monthly)
  exchange: CME                 # Chicago Mercantile Exchange
```

#### Strategy Parameters
```yaml
strategy:
  name: "Opening Range Breakout"
  opening_range_minutes: 5      # OR period length

  trading_window:
    start: "09:30"              # Market open (ET)
    end: "10:30"                # Window close (ET)
    timezone: "America/New_York"

  entry_rules:
    volume_confirmation: true    # Require volume spike
    volume_multiplier: 1.5       # 1.5x average volume
    min_breakout_points: 0.25    # Min distance from OR

  exit_rules:
    use_stop_loss: true
    stop_at_opposite_extreme: true
    risk_reward_ratio: 2.0       # Target at 2x risk
```

#### Risk Management
```yaml
risk_management:
  max_position_size: 1           # Max contracts (start small!)
  max_daily_loss: 500            # Stop trading if hit
  max_daily_trades: 3            # Max trades per day
  position_sizing_method: "fixed" # Or "kelly", "volatility_based"
```

#### Filters
```yaml
filters:
  avoid_news_days: true          # Skip FOMC, NFP, etc.
  min_volatility: 0              # Minimum VIX (0 = no filter)
  max_volatility: 100            # Maximum VIX
```

### Environment Variables (.env)

```env
# Broker Selection
BROKER=paper                    # Options: paper, alpaca, ib

# Alpaca Configuration (if using Alpaca)
ALPACA_API_KEY=your_key
ALPACA_SECRET_KEY=your_secret
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# Strategy Overrides (optional)
OPENING_RANGE_MINUTES=5
MAX_POSITION_SIZE=1
MAX_DAILY_LOSS=500

# Logging
LOG_LEVEL=INFO                  # DEBUG, INFO, WARNING, ERROR
LOG_FILE=logs/trading_bot.log
```

## Testing the Bot

### Phase 1: Simulator Test

Run the market simulator to test bot logic:

```bash
python simulator.py
```

**What happens:**
1. Bot starts in simulation mode
2. Generates realistic opening range (5 minutes)
3. Simulates breakout with volume confirmation
4. Executes trade through to target or stop
5. Displays final statistics

**Expected output:**
```
Opening Range: High=5003.50, Low=4998.25
BULLISH BREAKOUT detected
Long entry at 5004.00, stop at 4998.25
Target set at 5015.50
Position closed: target
Daily P&L: $575.00
```

**Success criteria:**
- ✅ Opening range calculated correctly
- ✅ Breakout detected with volume confirmation
- ✅ Orders executed (entry, stop, target)
- ✅ Position closed at target or stop
- ✅ P&L calculated accurately
- ✅ No errors in logs

### Phase 2: Paper Trading Test

Test with paper trading account:

1. **Set up paper trading**:
   ```env
   BROKER=alpaca
   ALPACA_BASE_URL=https://paper-api.alpaca.markets
   ```

2. **Run the bot**:
   ```bash
   python main.py
   ```

3. **Monitor for at least 3-5 days**:
   - Check logs daily: `tail -f logs/trading_bot.log`
   - Verify trades in broker dashboard
   - Confirm P&L accuracy
   - Test all scenarios (bullish, bearish, no breakout, news days)

4. **Review performance**:
   - Win rate
   - Average win vs. average loss
   - Maximum drawdown
   - Risk/reward ratio adherence

### Phase 3: Backtesting (Optional)

For thorough testing, backtest with historical data:

```python
# Create backtesting script (backtest.py)
# Import historical ES data
# Run bot simulation over past 6-12 months
# Analyze results
```

## Going Live

⚠️ **IMPORTANT: Only proceed after successful paper trading for at least 2-4 weeks**

### Pre-Live Checklist

- [ ] Paper trading profitable over 20+ trades
- [ ] All edge cases tested (news days, low volume, etc.)
- [ ] Risk parameters validated (max loss, position size)
- [ ] Broker connection stable
- [ ] Monitoring system in place
- [ ] Emergency shutdown procedure understood
- [ ] Sufficient account capital (minimum $10,000 recommended)

### Going Live Steps

1. **Update environment to live trading**:
   ```env
   BROKER=alpaca
   ALPACA_BASE_URL=https://api.alpaca.markets  # LIVE URL
   ```

2. **Reduce position size initially**:
   ```yaml
   risk_management:
     max_position_size: 1        # Start with minimum
     max_daily_loss: 250         # Reduce risk initially
   ```

3. **Start the bot**:
   ```bash
   python main.py
   ```

4. **Monitor closely**:
   - Watch first trade live
   - Check order fills
   - Verify P&L calculation
   - Monitor logs continuously

5. **Gradually scale up**:
   - After 10 successful trades, consider increasing size
   - Never risk more than 1-2% per trade
   - Maintain strict risk limits

## Troubleshooting

### Common Issues

#### 1. Import Errors

**Problem**: `ModuleNotFoundError: No module named 'pandas'`

**Solution**:
```bash
pip install -r requirements.txt
```

#### 2. Configuration File Not Found

**Problem**: `FileNotFoundError: config.yaml not found`

**Solution**:
```bash
# Ensure you're in the project root directory
ls config.yaml  # Should show the file
```

#### 3. Broker Connection Failed

**Problem**: Bot can't connect to broker

**Solution**:
- Verify API credentials in `.env`
- Check internet connection
- Confirm broker API is online
- Review broker API status page

#### 4. No Trades Executed

**Problem**: Bot runs but doesn't trade

**Possible causes**:
- News day filtered: Check logs for "Trading suspended"
- No breakout occurred: Check opening range vs. current price
- Risk limits hit: Verify daily loss/trade limits
- Outside trading window: Ensure time is 9:30-10:30 AM ET

**Debug**:
```bash
# Check logs
tail -100 logs/trading_bot.log

# Verify bot status
# Check "state" in logs: should progress through states
```

#### 5. Incorrect Timezone

**Problem**: Bot trades at wrong time

**Solution**:
```yaml
# In config.yaml, ensure:
trading_window:
  timezone: "America/New_York"  # Always ET for US markets
```

#### 6. Volume Confirmation Fails

**Problem**: Breakouts detected but not traded

**Solution**:
- Lower volume multiplier in config.yaml:
  ```yaml
  volume_multiplier: 1.2  # Reduce from 1.5
  ```
- Or disable volume confirmation temporarily:
  ```yaml
  volume_confirmation: false
  ```

### Getting Help

1. **Check Logs First**:
   ```bash
   tail -200 logs/trading_bot.log
   ```

2. **Verify Configuration**:
   ```bash
   cat config.yaml
   cat .env
   ```

3. **Test Components Individually**:
   ```bash
   python simulator.py  # Test in isolation
   ```

4. **Enable Debug Logging**:
   ```env
   LOG_LEVEL=DEBUG
   ```

5. **Common Log Messages**:

   - ✅ `"Opening Range calculated"` - OR detected successfully
   - ✅ `"BULLISH/BEARISH BREAKOUT"` - Trade signal generated
   - ✅ `"Position closed: target"` - Profit target hit
   - ⚠️ `"Trading not allowed: High-impact news day"` - News filter active
   - ⚠️ `"Cannot trade: Daily loss limit reached"` - Risk limit hit
   - ❌ `"Failed to submit order"` - Broker connection issue

## Maintenance

### Daily Tasks
- Check logs for errors
- Verify trades executed correctly
- Monitor P&L vs. expectations

### Weekly Tasks
- Review win rate and statistics
- Adjust parameters if needed
- Check news calendar for upcoming events

### Monthly Tasks
- Update contract month in config.yaml
- Review overall performance
- Rebalance risk parameters
- Update news dates if needed

---

## Next Steps

1. ✅ Complete installation
2. ✅ Run simulator test
3. ✅ Set up paper trading
4. ✅ Monitor for 2-4 weeks
5. ✅ Review and optimize
6. ⚠️ Consider going live (with caution!)

**Remember**: Start small, test thoroughly, and never risk more than you can afford to lose.

Good luck and trade safely! 🚀
