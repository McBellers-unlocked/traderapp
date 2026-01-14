// Dashboard JavaScript
const API_BASE = '';
let updateInterval = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadConfiguration();
    startUpdating();
});

function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startBot);
    document.getElementById('stopBtn').addEventListener('click', stopBot);
}

function startUpdating() {
    updateDashboard();
    updateInterval = setInterval(updateDashboard, 2000); // Update every 2 seconds
}

function stopUpdating() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

async function updateDashboard() {
    try {
        await Promise.all([
            updateStatus(),
            updateStatistics(),
            updateTrades()
        ]);

        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

async function updateStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/status`);
        const data = await response.json();

        // Update status indicator
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');

        if (data.running) {
            statusDot.className = 'status-dot running';
            statusText.textContent = 'Running';
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            statusDot.className = 'status-dot';
            statusText.textContent = 'Stopped';
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }

        // Update account info
        document.getElementById('balance').textContent = formatCurrency(data.account_balance);

        const dailyPnl = document.getElementById('dailyPnl');
        dailyPnl.textContent = formatCurrency(data.daily_pnl);
        dailyPnl.className = 'stat-value ' + (data.daily_pnl >= 0 ? 'positive' : 'negative');

        document.getElementById('botState').textContent = data.state || 'stopped';

        // Update opening range
        if (data.opening_range_calculated && data.opening_range) {
            document.getElementById('orHigh').textContent = data.opening_range.high.toFixed(2);
            document.getElementById('orLow').textContent = data.opening_range.low.toFixed(2);
            document.getElementById('orRange').textContent = data.opening_range.range.toFixed(2);
            document.getElementById('orStatus').textContent = 'Calculated ✓';
        } else {
            document.getElementById('orHigh').textContent = '-';
            document.getElementById('orLow').textContent = '-';
            document.getElementById('orRange').textContent = '-';
            document.getElementById('orStatus').textContent = 'Not calculated';
        }

        // Update position
        const positionInfo = document.getElementById('positionInfo');
        if (data.has_position && data.position) {
            const pos = data.position;
            positionInfo.innerHTML = `
                <p><strong>Symbol:</strong> ${pos.symbol}</p>
                <p><strong>Side:</strong> <span class="trade-side ${pos.side}">${pos.side.toUpperCase()}</span></p>
                <p><strong>Quantity:</strong> ${pos.quantity}</p>
                <p><strong>Entry:</strong> ${pos.entry_price.toFixed(2)}</p>
                <p><strong>Stop:</strong> ${pos.stop_price.toFixed(2)}</p>
                <p><strong>Target:</strong> ${pos.target_price.toFixed(2)}</p>
                <p><strong>Risk:</strong> ${pos.risk_points.toFixed(2)} pts</p>
                <p><strong>Reward:</strong> ${pos.reward_points.toFixed(2)} pts</p>
            `;
        } else {
            positionInfo.innerHTML = '<p class="no-position">No open position</p>';
        }

        // Update risk status
        if (data.risk_status) {
            const risk = data.risk_status;
            document.getElementById('canTrade').textContent = risk.can_trade ? 'Yes ✓' : 'No ✗';
            document.getElementById('canTrade').className = 'stat-value small ' + (risk.can_trade ? 'positive' : 'negative');

            if (risk.trades_today !== undefined) {
                document.getElementById('tradesToday').textContent =
                    `${risk.trades_today}/${risk.max_daily_trades || '-'}`;
            }

            if (risk.remaining_loss_limit !== undefined) {
                document.getElementById('lossLimit').textContent = formatCurrency(risk.remaining_loss_limit);
            }
        }

    } catch (error) {
        console.error('Error updating status:', error);
    }
}

async function updateStatistics() {
    try {
        const response = await fetch(`${API_BASE}/api/statistics`);
        const data = await response.json();

        document.getElementById('totalTrades').textContent = data.total_trades || 0;
        document.getElementById('winRate').textContent = (data.win_rate || 0).toFixed(1) + '%';
        document.getElementById('winningTrades').textContent = data.winning_trades || 0;
        document.getElementById('losingTrades').textContent = data.losing_trades || 0;
        document.getElementById('avgWin').textContent = formatCurrency(data.average_win || 0);
        document.getElementById('avgLoss').textContent = formatCurrency(data.average_loss || 0);

    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

async function updateTrades() {
    try {
        const response = await fetch(`${API_BASE}/api/trades`);
        const trades = await response.json();

        const tradeHistory = document.getElementById('tradeHistory');

        if (!trades || trades.length === 0) {
            tradeHistory.innerHTML = '<p class="no-trades">No trades yet</p>';
            return;
        }

        tradeHistory.innerHTML = trades.map(trade => `
            <div class="trade-item ${trade.pnl >= 0 ? 'profit' : 'loss'}">
                <div class="trade-side ${trade.side}">${trade.side}</div>
                <div class="trade-details">
                    ${trade.symbol}: ${trade.entry_price.toFixed(2)} → ${trade.exit_price.toFixed(2)}
                    <br>
                    <small>${new Date(trade.timestamp).toLocaleString()}</small>
                </div>
                <div class="trade-pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}">
                    ${formatCurrency(trade.pnl)}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error updating trades:', error);
    }
}

async function loadConfiguration() {
    try {
        const response = await fetch(`${API_BASE}/api/config`);
        const config = await response.json();

        const configInfo = document.getElementById('configInfo');
        configInfo.innerHTML = `
            <div class="config-item">
                <strong>Symbol</strong>
                <span>${config.symbol}</span>
            </div>
            <div class="config-item">
                <strong>Opening Range</strong>
                <span>${config.opening_range_minutes} minutes</span>
            </div>
            <div class="config-item">
                <strong>Trading Window</strong>
                <span>${config.trading_window_start} - ${config.trading_window_end}</span>
            </div>
            <div class="config-item">
                <strong>Risk/Reward</strong>
                <span>${config.risk_reward_ratio}:1</span>
            </div>
            <div class="config-item">
                <strong>Max Position</strong>
                <span>${config.max_position_size} contracts</span>
            </div>
            <div class="config-item">
                <strong>Max Daily Loss</strong>
                <span>${formatCurrency(config.max_daily_loss)}</span>
            </div>
            <div class="config-item">
                <strong>Max Daily Trades</strong>
                <span>${config.max_daily_trades}</span>
            </div>
            <div class="config-item">
                <strong>Volume Confirmation</strong>
                <span>${config.volume_confirmation ? 'Enabled ✓' : 'Disabled ✗'}</span>
            </div>
            <div class="config-item">
                <strong>News Filter</strong>
                <span>${config.avoid_news_days ? 'Enabled ✓' : 'Disabled ✗'}</span>
            </div>
        `;

    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

async function startBot() {
    if (!confirm('Are you sure you want to start the trading bot?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/start`, {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            alert('Bot started successfully!');
            updateDashboard();
        } else {
            alert('Error starting bot: ' + data.error);
        }
    } catch (error) {
        alert('Error starting bot: ' + error.message);
    }
}

async function stopBot() {
    if (!confirm('Are you sure you want to stop the trading bot?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/stop`, {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            alert('Bot stopped successfully!');
            updateDashboard();
        } else {
            alert('Error stopping bot: ' + data.error);
        }
    } catch (error) {
        alert('Error stopping bot: ' + error.message);
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}
