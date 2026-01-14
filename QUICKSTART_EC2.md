# ⚡ Quick Start - Deploy in 5 Minutes

Get your trading bot with web dashboard running on AWS EC2 in just 5 minutes!

## Step 1: Launch EC2 (2 minutes)

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Launch Instance**
3. Configure:
   - **Name**: `trading-bot`
   - **AMI**: Amazon Linux 2023
   - **Instance**: t3.micro (free tier)
   - **Key pair**: Create new or select existing
   - **Security Group**:
     - ✅ SSH (22) - From My IP
     - ✅ HTTP (80) - From Anywhere
   - **Storage**: 20 GB
4. Click **Launch Instance**
5. **Copy the Public IP** from instance details

## Step 2: Connect (1 minute)

```bash
# Download your .pem key if new, then:
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@YOUR_PUBLIC_IP
```

## Step 3: Deploy (2 minutes)

Run these commands on your EC2 instance:

```bash
# Clone repository
git clone <YOUR_REPO_URL> ~/traderapp
cd ~/traderapp

# Run automated setup
chmod +x deployment/setup_ec2.sh
./deployment/setup_ec2.sh
```

The script installs everything automatically!

## Step 4: Configure (30 seconds)

```bash
# Edit configuration (optional - has working defaults)
nano .env
nano config.yaml
```

## Step 5: Access Dashboard (10 seconds)

Open browser and go to:
```
http://YOUR_PUBLIC_IP
```

**That's it!** 🎉

## What You'll See

- 📊 **Real-time dashboard** with bot status
- 💰 **Account balance** and daily P&L
- 📈 **Opening range** values
- 🎯 **Current position** details
- 📉 **Trade history** and statistics
- ⚙️ **Start/Stop controls**

## Quick Commands

```bash
# View logs
journalctl -u trading-bot -f

# Restart bot
sudo systemctl restart trading-bot

# Check status
sudo systemctl status trading-bot
```

## Cost

**~$10-11/month** for t3.micro instance

Free tier eligible for first 12 months!

## Next Steps

1. ✅ Click "Start Bot" in dashboard
2. ✅ Watch the opening range calculation
3. ✅ Monitor for breakout signals
4. ✅ Test with paper trading for 2-4 weeks
5. ⚠️ Only then consider live trading

## Security Tips

- ✅ Change SSH to "My IP only" in Security Group
- ✅ Add dashboard password (see EC2_DEPLOYMENT.md)
- ✅ Set up HTTPS for production

## Troubleshooting

**Dashboard not loading?**
```bash
# Check services
sudo systemctl status trading-bot
sudo systemctl status nginx

# View logs
journalctl -u trading-bot -n 50
```

**Can't connect?**
- Verify Security Group allows HTTP (port 80)
- Check Public IP is correct
- Instance must be "running" state

## Full Documentation

See [EC2_DEPLOYMENT.md](EC2_DEPLOYMENT.md) for:
- Security setup
- HTTPS configuration
- Monitoring & alerts
- Cost optimization
- Advanced troubleshooting

---

**Happy Trading!** 🚀

Dashboard URL: `http://YOUR_PUBLIC_IP`
