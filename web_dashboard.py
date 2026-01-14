#!/usr/bin/env python3
"""Web dashboard for monitoring and controlling the trading bot."""
import os
import json
from datetime import datetime
from threading import Thread, Lock
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

from src.utils.config import Config
from src.utils.logger import Logger
from src.bot.trading_bot import TradingBot
from src.data.market_data import Bar


app = Flask(__name__)
CORS(app)

# Global bot instance and state
bot_instance = None
bot_thread = None
bot_lock = Lock()
bot_status = {
    'running': False,
    'state': 'stopped',
    'error': None
}


def run_bot_in_thread():
    """Run the bot in a background thread."""
    global bot_instance, bot_status

    try:
        bot_status['running'] = True
        bot_status['error'] = None

        # Bot will run continuously
        while bot_instance and bot_instance.is_running:
            import time
            time.sleep(1)

    except Exception as e:
        bot_status['error'] = str(e)
        bot_status['running'] = False
        if bot_instance:
            bot_instance.stop()


@app.route('/')
def index():
    """Serve the main dashboard page."""
    return render_template('dashboard.html')


@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current bot status."""
    with bot_lock:
        if bot_instance is None:
            return jsonify({
                'running': False,
                'state': 'stopped',
                'error': None,
                'account_balance': 0,
                'daily_pnl': 0
            })

        status = bot_instance.get_status()
        status['running'] = bot_status['running']
        status['error'] = bot_status['error']

        # Add account info
        status['account_balance'] = bot_instance.broker.get_account_balance()
        status['daily_pnl'] = bot_instance.broker.get_daily_pnl()

        # Convert datetime objects to strings
        if 'current_date' in status and status['current_date']:
            status['current_date'] = status['current_date'].isoformat()

        return jsonify(status)


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get trading statistics."""
    with bot_lock:
        if bot_instance is None:
            return jsonify({'error': 'Bot not initialized'})

        stats = bot_instance.broker.get_statistics()
        return jsonify(stats)


@app.route('/api/trades', methods=['GET'])
def get_trades():
    """Get trade history."""
    with bot_lock:
        if bot_instance is None:
            return jsonify([])

        trades = bot_instance.broker.get_trade_history()

        # Convert datetime objects to strings
        for trade in trades:
            if 'timestamp' in trade:
                trade['timestamp'] = trade['timestamp'].isoformat()

        return jsonify(trades)


@app.route('/api/start', methods=['POST'])
def start_bot():
    """Start the trading bot."""
    global bot_instance, bot_thread, bot_status

    with bot_lock:
        if bot_status['running']:
            return jsonify({'error': 'Bot is already running'}), 400

        try:
            # Initialize bot
            config = Config("config.yaml")
            bot_instance = TradingBot(config)
            bot_instance.start()

            # Start bot thread
            bot_thread = Thread(target=run_bot_in_thread, daemon=True)
            bot_thread.start()

            return jsonify({'message': 'Bot started successfully'})

        except Exception as e:
            bot_status['error'] = str(e)
            return jsonify({'error': str(e)}), 500


@app.route('/api/stop', methods=['POST'])
def stop_bot():
    """Stop the trading bot."""
    global bot_instance, bot_status

    with bot_lock:
        if not bot_status['running']:
            return jsonify({'error': 'Bot is not running'}), 400

        try:
            if bot_instance:
                bot_instance.stop()

            bot_status['running'] = False
            bot_status['state'] = 'stopped'

            return jsonify({'message': 'Bot stopped successfully'})

        except Exception as e:
            return jsonify({'error': str(e)}), 500


@app.route('/api/feed_bar', methods=['POST'])
def feed_bar():
    """Feed a price bar to the bot (for testing/simulation)."""
    with bot_lock:
        if bot_instance is None or not bot_status['running']:
            return jsonify({'error': 'Bot is not running'}), 400

        try:
            data = request.json

            # Parse timestamp
            timestamp = datetime.fromisoformat(data['timestamp'])

            # Create bar
            bar = Bar(
                timestamp=timestamp,
                open_price=float(data['open']),
                high=float(data['high']),
                low=float(data['low']),
                close=float(data['close']),
                volume=int(data['volume'])
            )

            # Feed to bot
            bot_instance.on_bar(bar)

            return jsonify({'message': 'Bar processed successfully'})

        except Exception as e:
            return jsonify({'error': str(e)}), 500


@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current configuration."""
    try:
        config = Config("config.yaml")

        return jsonify({
            'symbol': config.symbol,
            'opening_range_minutes': config.opening_range_minutes,
            'trading_window_start': config.trading_window_start,
            'trading_window_end': config.trading_window_end,
            'risk_reward_ratio': config.risk_reward_ratio,
            'max_position_size': config.max_position_size,
            'max_daily_loss': config.max_daily_loss,
            'max_daily_trades': config.max_daily_trades,
            'volume_confirmation': config.volume_confirmation,
            'avoid_news_days': config.avoid_news_days
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


if __name__ == '__main__':
    # Run Flask app
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    print(f"\n{'='*80}")
    print("ES FUTURES TRADING BOT - WEB DASHBOARD")
    print(f"{'='*80}")
    print(f"\nDashboard URL: http://localhost:{port}")
    print("\nAPI Endpoints:")
    print("  GET  /api/status      - Bot status and position info")
    print("  GET  /api/statistics  - Trading statistics")
    print("  GET  /api/trades      - Trade history")
    print("  POST /api/start       - Start the bot")
    print("  POST /api/stop        - Stop the bot")
    print("  GET  /api/config      - View configuration")
    print("  GET  /api/health      - Health check")
    print(f"\n{'='*80}\n")

    app.run(host='0.0.0.0', port=port, debug=debug)
