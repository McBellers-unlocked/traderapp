# EC2 Deployment Guide - ES Futures Trading Bot

Complete guide for deploying the trading bot with web dashboard on AWS EC2.

## 📋 Prerequisites

- AWS Account with EC2 access
- Basic knowledge of SSH and Linux
- Credit card for AWS services (expect $10-30/month)

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Launch EC2 Instance

1. **Go to AWS EC2 Console**
   - Navigate to: https://console.aws.amazon.com/ec2/

2. **Launch Instance**
   - Click "Launch Instance"
   - **Name**: `trading-bot-server`
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04 LTS
   - **Instance Type**: `t3.micro` (1 GB RAM) - Free tier eligible
   - **Key Pair**: Create new or use existing
   - **Network Settings**:
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere (0.0.0.0/0)
   - **Storage**: 20 GB gp3

3. **Launch and wait** for instance to start

4. **Note your Public IP**: You'll find it in the instance details

### Step 2: Connect to EC2

```bash
# Download your key pair (.pem file) if you created a new one
# Set permissions
chmod 400 your-key.pem

# Connect to instance
# For Amazon Linux:
ssh -i your-key.pem ec2-user@YOUR_PUBLIC_IP

# For Ubuntu:
ssh -i your-key.pem ubuntu@YOUR_PUBLIC_IP
```

### Step 3: Deploy the Bot

Once connected to your EC2 instance:

```bash
# Clone the repository
git clone <your-repository-url> /home/ec2-user/traderapp
# Or if using ubuntu: /home/ubuntu/traderapp

cd traderapp

# Run the automated setup script
chmod +x deployment/setup_ec2.sh
./deployment/setup_ec2.sh
```

The script will automatically:
- ✅ Install Python 3.9+, pip, git, nginx
- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Set up systemd service
- ✅ Configure nginx reverse proxy
- ✅ Start all services

### Step 4: Configure the Bot

```bash
# Edit environment variables
nano .env

# Edit strategy configuration
nano config.yaml
```

### Step 5: Access Dashboard

Open your browser and go to:
```
http://YOUR_PUBLIC_IP
```

You should see the trading bot dashboard! 🎉

## 📊 Using the Dashboard

The web dashboard provides:

### **Real-Time Monitoring**
- Bot status (running/stopped)
- Account balance and daily P&L
- Opening range values (high/low/range)
- Current position details
- Risk status

### **Controls**
- **Start Bot** - Begin trading
- **Stop Bot** - Stop all trading
- Auto-refresh every 2 seconds

### **Statistics**
- Total trades
- Win rate
- Average win/loss
- Trade history with P&L

### **Configuration View**
- All strategy parameters
- Risk settings
- Trading window

## 🔧 Managing the Bot

### Service Commands

```bash
# Check status
sudo systemctl status trading-bot

# View live logs
journalctl -u trading-bot -f

# Restart bot
sudo systemctl restart trading-bot

# Stop bot
sudo systemctl stop trading-bot

# Start bot
sudo systemctl start trading-bot

# Restart nginx
sudo systemctl restart nginx
```

### Log Files

```bash
# Bot logs
tail -f ~/traderapp/logs/trading_bot.log

# System logs
journalctl -u trading-bot --since "1 hour ago"

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updating the Bot

```bash
cd ~/traderapp

# Pull latest changes
git pull

# Activate virtual environment
source venv/bin/activate

# Install any new dependencies
pip install -r requirements.txt

# Restart the service
sudo systemctl restart trading-bot
```

## 🔒 Security Best Practices

### 1. Restrict SSH Access

```bash
# Edit security group to only allow SSH from your IP
# Go to EC2 Console → Security Groups → Edit Inbound Rules
# SSH: Only from My IP
```

### 2. Add Basic Authentication (Recommended)

Install nginx authentication:

```bash
# Install apache2-utils
sudo yum install -y httpd-tools  # Amazon Linux
# or
sudo apt-get install -y apache2-utils  # Ubuntu

# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Edit nginx config
sudo nano /etc/nginx/conf.d/trading-bot.conf
```

Add inside the `location /` block:
```nginx
auth_basic "Trading Bot Dashboard";
auth_basic_user_file /etc/nginx/.htpasswd;
```

Restart nginx:
```bash
sudo systemctl restart nginx
```

### 3. Set Up HTTPS (Production)

```bash
# Install certbot
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
# or
sudo apt-get install -y certbot python3-certbot-nginx  # Ubuntu

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com
```

### 4. Configure Firewall

```bash
# Amazon Linux
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Ubuntu
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 💰 Cost Estimation

### Monthly Costs

**t3.micro (Recommended for testing)**
- Instance: ~$7.50/month (730 hours × $0.0104)
- Storage: ~$2/month (20 GB × $0.10)
- Data Transfer: ~$1/month (light usage)
- **Total: ~$10-11/month**

**t3.small (Better performance)**
- Instance: ~$15/month
- Storage: ~$2/month
- Data Transfer: ~$1/month
- **Total: ~$18-20/month**

**t3.medium (Production)**
- Instance: ~$30/month
- Storage: ~$2/month
- Data Transfer: ~$2/month
- **Total: ~$34-35/month**

### Cost Optimization

1. **Use Spot Instances** - Save up to 90%
   - Good for testing, but can be terminated
   - Not recommended for live trading

2. **Reserved Instances** - Save up to 60%
   - Commit to 1 or 3 years
   - Best for production long-term

3. **Stop Instance When Not Trading**
   ```bash
   # You only pay for storage when stopped (~$2/month)
   # Automate start/stop with AWS Lambda
   ```

## 🔍 Monitoring & Alerts

### CloudWatch Integration

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure to send logs to CloudWatch
```

### Set Up Alerts

Create CloudWatch alarms for:
- CPU > 80%
- Memory > 80%
- Bot service down
- Daily loss limit approaching

## 🐛 Troubleshooting

### Bot Not Starting

```bash
# Check service status
sudo systemctl status trading-bot

# Check logs for errors
journalctl -u trading-bot -n 50

# Verify Python dependencies
cd ~/traderapp
source venv/bin/activate
pip list
```

### Dashboard Not Loading

```bash
# Check nginx status
sudo systemctl status nginx

# Test nginx configuration
sudo nginx -t

# Check if bot is listening on port 5000
sudo netstat -tlnp | grep 5000

# Check firewall
sudo iptables -L
```

### Can't Connect to Instance

1. Verify Security Group allows HTTP (port 80)
2. Check instance is running (not stopped)
3. Verify public IP address is correct
4. Try accessing from different network

### Bot Running But Not Trading

1. Check logs: `tail -f ~/traderapp/logs/trading_bot.log`
2. Verify time is correct: `date`
3. Check if it's a news day (filtered)
4. Verify trading window (9:30-10:30 AM ET)

## 📱 Mobile Access

The dashboard is mobile-responsive! Access from:
- iPhone Safari
- Android Chrome
- Tablet browsers

Just navigate to: `http://YOUR_PUBLIC_IP`

## 🔄 Automatic Backups

### Backup Script

Create `/home/ec2-user/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/ec2-user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
    ~/traderapp/.env \
    ~/traderapp/config.yaml

# Backup logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz \
    ~/traderapp/logs/

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

### Automate with Cron

```bash
chmod +x /home/ec2-user/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /home/ec2-user/backup.sh
```

## 🎓 Next Steps

1. ✅ Test with paper trading first
2. ✅ Monitor for 2-4 weeks
3. ✅ Set up CloudWatch alerts
4. ✅ Configure automatic backups
5. ✅ Add HTTPS for security
6. ⚠️ Consider going live (with extreme caution!)

## 📞 Support

**Common Commands Cheat Sheet:**

```bash
# Service management
sudo systemctl status trading-bot    # Check status
sudo systemctl restart trading-bot   # Restart bot
journalctl -u trading-bot -f         # Live logs

# Configuration
nano ~/traderapp/.env                # Edit environment
nano ~/traderapp/config.yaml         # Edit strategy

# Logs
tail -f ~/traderapp/logs/trading_bot.log

# Updates
cd ~/traderapp && git pull
sudo systemctl restart trading-bot
```

---

**Your EC2 trading bot is now live with a beautiful web dashboard!** 🚀

Access it at: `http://YOUR_PUBLIC_IP`

Remember: Always test thoroughly before live trading!
