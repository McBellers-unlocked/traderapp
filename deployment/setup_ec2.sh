#!/bin/bash
# EC2 Setup Script for Trading Bot
# Run this script on a fresh Amazon Linux 2 or Ubuntu EC2 instance

set -e  # Exit on error

echo "=================================="
echo "ES Trading Bot - EC2 Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Please do not run as root. Run as ec2-user or ubuntu.${NC}"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo -e "${RED}Cannot detect OS${NC}"
    exit 1
fi

echo -e "${GREEN}Detected OS: $OS${NC}"

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
if [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ]; then
    sudo yum update -y
    sudo yum install -y python3 python3-pip git nginx
elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip python3-venv git nginx
fi

# Install Python 3.9+ if needed
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo -e "${GREEN}Python version: $PYTHON_VERSION${NC}"

# Create application directory
APP_DIR="/home/$USER/traderapp"
echo -e "${YELLOW}Setting up application directory: $APP_DIR${NC}"

if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}Please clone the repository first to $APP_DIR${NC}"
    echo "Run: git clone <repository-url> $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

# Create virtual environment
echo -e "${YELLOW}Creating Python virtual environment...${NC}"
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p logs
mkdir -p data

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
fi

# Set up systemd service
echo -e "${YELLOW}Setting up systemd service...${NC}"
sudo bash -c "cat > /etc/systemd/system/trading-bot.service" << EOF
[Unit]
Description=ES Futures Trading Bot
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
Environment="PATH=$APP_DIR/venv/bin"
ExecStart=$APP_DIR/venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 --timeout 300 web_dashboard:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Set up nginx configuration
echo -e "${YELLOW}Setting up nginx reverse proxy...${NC}"
sudo bash -c "cat > /etc/nginx/conf.d/trading-bot.conf" << 'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support (if needed later)
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /static/ {
        alias $APP_DIR/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Remove default nginx configuration if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# Test nginx configuration
echo -e "${YELLOW}Testing nginx configuration...${NC}"
sudo nginx -t

# Enable and start services
echo -e "${YELLOW}Enabling and starting services...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable trading-bot
sudo systemctl enable nginx
sudo systemctl restart nginx
sudo systemctl start trading-bot

# Wait a moment for service to start
sleep 3

# Check service status
echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}==================================${NC}\n"

echo "Service Status:"
sudo systemctl status trading-bot --no-pager | head -10

echo -e "\n${YELLOW}Important:${NC}"
echo "1. Edit configuration: nano $APP_DIR/.env"
echo "2. Edit strategy config: nano $APP_DIR/config.yaml"
echo "3. View logs: journalctl -u trading-bot -f"
echo "4. Restart bot: sudo systemctl restart trading-bot"
echo ""
echo "Dashboard should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
echo -e "${YELLOW}Security Reminder:${NC}"
echo "- Configure AWS Security Group to allow port 80 (HTTP)"
echo "- For production, set up HTTPS with Let's Encrypt"
echo "- Restrict dashboard access with authentication"
echo ""
echo -e "${GREEN}Setup script completed successfully!${NC}"
