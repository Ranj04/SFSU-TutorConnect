# Quick Start: GitHub Actions Deployment

## 🚀 Fast Setup (5 minutes)

### Step 1: Add GitHub Secrets (2 minutes)

Go to: **Repository Settings → Secrets and variables → Actions → New repository secret**

Add these 4 secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `EC2_HOST` | Your server IP | `3.132.193.62` |
| `EC2_USER` | SSH username | `ubuntu` |
| `EC2_SSH_KEY` | Full contents of `.pem` file | `-----BEGIN RSA PRIVATE KEY-----...` |
| `EC2_PORT` | SSH port | `22` |

**⚠️ For EC2_SSH_KEY:** Copy the ENTIRE file content including `-----BEGIN` and `-----END` lines.

**Windows PowerShell:**
```powershell
Get-Content credentials\csc648-team02-key.pem -Raw
```

**Mac/Linux:**
```bash
cat credentials/csc648-team02-key.pem
```

### Step 2: Verify Server Setup (2 minutes)

SSH into your server:
```bash
ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62
```

Check/Setup:
```bash
# 1. Project directory exists
cd /home/ubuntu/csc648-fa25-03-team02 || mkdir -p /home/ubuntu/csc648-fa25-03-team02

# 2. Git is initialized (if not)
cd /home/ubuntu/csc648-fa25-03-team02
[ ! -d .git ] && git init && git remote add origin https://github.com/YOUR_USERNAME/csc648-fa25-03-team02.git

# 3. Backend service exists
sudo systemctl status tutorconnect-api || echo "Service doesn't exist - see full guide"

# 4. Nginx is running
sudo systemctl status nginx || sudo apt install nginx -y
```

### Step 3: Test Deployment (1 minute)

Push to main branch:
```bash
git checkout main
git add .
git commit -m "Test: Trigger deployment"
git push origin main
```

Watch it deploy:
1. Go to GitHub → Your Repo → **Actions** tab
2. Click on the running workflow
3. Watch the logs

---

## ✅ What Happens When You Push to Main

1. **GitHub Actions triggers** automatically
2. **Creates backup** of current deployment
3. **Pulls latest code** from main branch
4. **Deploys backend:**
   - Updates Python dependencies
   - Runs database migrations
   - Restarts API service
5. **Deploys frontend:**
   - Builds React app with production settings
   - Updates Nginx configuration
6. **Health checks** verify deployment
7. **Rolls back** automatically if anything fails

---

## 🔍 Troubleshooting

### "Permission denied (publickey)"
- Check `EC2_SSH_KEY` secret includes full key with BEGIN/END lines
- No extra spaces or line breaks

### "Service not found"
- Create systemd service (see full guide: `GITHUB_ACTIONS_SETUP.md`)

### "Build failed"
- Check GitHub Actions logs for specific error
- Verify Node.js/Python are installed on server

### "Health check failed"
- SSH into server: `sudo systemctl status tutorconnect-api`
- Check logs: `sudo journalctl -u tutorconnect-api -n 50`

---

## 📚 Full Documentation

For detailed setup instructions, see: **`GITHUB_ACTIONS_SETUP.md`**

---

## 🎯 Common Commands

**Check deployment status:**
```bash
ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62
sudo systemctl status tutorconnect-api
sudo systemctl status nginx
```

**View backend logs:**
```bash
sudo journalctl -u tutorconnect-api -f
```

**View nginx logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Manual deployment (if needed):**
```bash
cd /home/ubuntu/csc648-fa25-03-team02
git pull origin main
cd application/backend && source venv/bin/activate && pip install -r requirements.txt
sudo systemctl restart tutorconnect-api
cd ../client && npm ci && npm run build
sudo systemctl reload nginx
```

