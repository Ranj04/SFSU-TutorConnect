# GitHub Actions AWS Deployment Setup Guide

This guide will walk you through setting up automatic deployment to your AWS EC2 instance when you push to the `main` branch.

## Prerequisites

Before starting, make sure you have:
- ✅ Access to your GitHub repository
- ✅ SSH access to your AWS EC2 instance (IP: 3.132.193.62)
- ✅ The SSH private key file (`csc648-team02-key.pem`) from the `credentials/` folder
- ✅ Admin/owner access to the GitHub repository (to add secrets)

---

## Step 1: Prepare Your SSH Key

### 1.1 Locate Your SSH Key
Your SSH key should be in: `credentials/csc648-team02-key.pem`

### 1.2 Get the Full Content of Your SSH Key
You need to copy the **entire contents** of the private key file. The key should look like:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(many lines of encoded text)
...
-----END RSA PRIVATE KEY-----
```

**On Windows (PowerShell):**
```powershell
Get-Content credentials\csc648-team02-key.pem -Raw
```

**On Mac/Linux:**
```bash
cat credentials/csc648-team02-key.pem
```

**⚠️ IMPORTANT:** Copy the ENTIRE output, including the `-----BEGIN` and `-----END` lines.

---

## Step 2: Add GitHub Secrets

GitHub Secrets are encrypted variables that only GitHub Actions can access. You need to add 4 secrets:

### 2.1 Navigate to GitHub Secrets
1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/csc648-fa25-03-team02`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2.2 Add Each Secret

Add these 4 secrets one by one:

#### Secret 1: `EC2_HOST`
- **Name:** `EC2_HOST`
- **Value:** `3.132.193.62`
- Click **Add secret**

#### Secret 2: `EC2_USER`
- **Name:** `EC2_USER`
- **Value:** `ubuntu`
- Click **Add secret**

#### Secret 3: `EC2_SSH_KEY`
- **Name:** `EC2_SSH_KEY`
- **Value:** Paste the **ENTIRE** contents of your `csc648-team02-key.pem` file (from Step 1.2)
  - Must include `-----BEGIN RSA PRIVATE KEY-----` at the start
  - Must include `-----END RSA PRIVATE KEY-----` at the end
  - Include all lines in between
- Click **Add secret**

#### Secret 4: `EC2_PORT` (Optional, but recommended)
- **Name:** `EC2_PORT`
- **Value:** `22`
- Click **Add secret**

### 2.3 Verify Secrets
After adding all secrets, you should see:
- ✅ EC2_HOST
- ✅ EC2_USER
- ✅ EC2_SSH_KEY
- ✅ EC2_PORT (optional)

**⚠️ IMPORTANT:** Once you add a secret, you cannot view its value again. If you make a mistake, delete it and create a new one.

---

## Step 3: Verify Your Server Setup

Before the workflow can deploy, your AWS server needs to be set up correctly.

### 3.1 SSH into Your Server
```bash
ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62
```

### 3.2 Verify Directory Structure
Once connected, check that the project directory exists:
```bash
cd /home/ubuntu/csc648-fa25-03-team02
ls -la
```

If the directory doesn't exist, create it:
```bash
mkdir -p /home/ubuntu/csc648-fa25-03-team02
cd /home/ubuntu/csc648-fa25-03-team02
git init
git remote add origin https://github.com/YOUR_USERNAME/csc648-fa25-03-team02.git
```

### 3.3 Verify Git is Configured
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@sfsu.edu"
```

### 3.4 Verify System Service (Backend)
Check if the backend service exists:
```bash
sudo systemctl status tutorconnect-api
```

If it doesn't exist, you'll need to create it. See **Step 4** below.

### 3.5 Verify Nginx is Running
```bash
sudo systemctl status nginx
```

If nginx is not installed:
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## Step 4: Create Systemd Service for Backend (If Needed)

If the `tutorconnect-api` service doesn't exist, create it:

### 4.1 Create Service File
```bash
sudo nano /etc/systemd/system/tutorconnect-api.service
```

### 4.2 Add This Content
```ini
[Unit]
Description=TutorConnect API (FastAPI/Gunicorn)
After=network.target mysql.service

[Service]
Type=notify
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/csc648-fa25-03-team02/application/backend
Environment="PATH=/home/ubuntu/csc648-fa25-03-team02/application/backend/venv/bin"
ExecStart=/home/ubuntu/csc648-fa25-03-team02/application/backend/venv/bin/gunicorn \
    --bind 127.0.0.1:8000 \
    --workers 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    app.main:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 4.3 Save and Enable Service
```bash
# Save the file (Ctrl+X, then Y, then Enter in nano)
sudo systemctl daemon-reload
sudo systemctl enable tutorconnect-api
sudo systemctl start tutorconnect-api
sudo systemctl status tutorconnect-api
```

---

## Step 5: Configure Nginx (If Needed)

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/sfsututor.site
```

### 5.2 Add This Configuration
```nginx
server {
    listen 80;
    server_name sfsututor.site www.sfsututor.site;

    # Allow larger file uploads (for profile pictures, etc.)
    client_max_body_size 10M;

    # Frontend (React app)
    location / {
        root /home/ubuntu/csc648-fa25-03-team02/application/client/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Allow larger file uploads for API endpoints
        client_max_body_size 10M;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        proxy_set_header Host $host;
    }

    # API docs
    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
        proxy_set_header Host $host;
    }
}
```

### 5.3 Enable Site and Test
```bash
sudo ln -s /etc/nginx/sites-available/sfsututor.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 6: Test the Workflow

### 6.1 Make a Test Commit
Make a small change to trigger the workflow:
```bash
# On your local machine
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test: Trigger deployment workflow"
git push origin main
```

### 6.2 Monitor the Workflow
1. Go to your GitHub repository
2. Click on the **Actions** tab
3. You should see "Deploy to Production" workflow running
4. Click on it to see the progress

### 6.3 Check for Errors
If the workflow fails:
- Click on the failed step to see error messages
- Common issues are listed in the **Troubleshooting** section below

---

## Step 7: Verify Deployment

After the workflow completes successfully:

### 7.1 Check Backend
```bash
curl https://sfsututor.site/health
```
Should return: `{"status":"ok","message":"TutorConnect API is running"}`

### 7.2 Check Frontend
Open in browser: `https://sfsututor.site` (or `http://sfsututor.site` if SSL not configured)

---

## Troubleshooting

### Issue: "Permission denied (publickey)"
**Solution:**
- Verify the SSH key secret (`EC2_SSH_KEY`) includes the full key with BEGIN/END lines
- Make sure there are no extra spaces or line breaks
- Try copying the key again from the `.pem` file

### Issue: "Host key verification failed"
**Solution:**
- SSH into the server manually first: `ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62`
- Accept the host key when prompted
- The workflow should work after this

### Issue: "Service tutorconnect-api not found"
**Solution:**
- Follow **Step 4** above to create the systemd service
- Make sure the paths in the service file match your actual directory structure

### Issue: "git pull failed" or "not a git repository"
**Solution:**
- SSH into the server
- Navigate to `/home/ubuntu/csc648-fa25-03-team02`
- Run: `git init` and `git remote add origin YOUR_REPO_URL`
- Or clone the repo fresh: `git clone YOUR_REPO_URL /home/ubuntu/csc648-fa25-03-team02`

### Issue: "npm ci failed" or "pip install failed"
**Solution:**
- Make sure Node.js and Python are installed on the server
- Check that `package.json` and `requirements.txt` are valid
- SSH into server and manually run the commands to see detailed errors

### Issue: "Health check failed"
**Solution:**
- SSH into server and check service status: `sudo systemctl status tutorconnect-api`
- Check logs: `sudo journalctl -u tutorconnect-api -n 50`
- Verify nginx is running: `sudo systemctl status nginx`
- Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Issue: "Build verification failed - localhost:8000 found"
**Solution:**
- The `.env` file might not be created correctly
- Check the workflow logs to see if `.env` file creation succeeded
- Verify the build step is using the correct environment variables

---

## Workflow File Location

The workflow file is located at:
```
.github/workflows/production-deploy.yml
```

You can view and edit it in your repository. The workflow will automatically run when you push to the `main` branch.

---

## Security Notes

- ⚠️ **Never commit your SSH private key to the repository**
- ⚠️ **Never commit passwords or secrets to the repository**
- ✅ **Always use GitHub Secrets for sensitive data**
- ✅ **The SSH key in GitHub Secrets is encrypted and only accessible to GitHub Actions**

---

## Need Help?

If you're still having issues:
1. Check the GitHub Actions logs (Actions tab → Click on failed workflow → Click on failed step)
2. SSH into your server and manually run the deployment commands
3. Verify all secrets are set correctly in GitHub Settings
4. Check that your server has all required software installed (git, node, python, nginx, mysql)

---

## Quick Checklist

Before your first deployment, verify:
- [ ] All 4 GitHub Secrets are added (EC2_HOST, EC2_USER, EC2_SSH_KEY, EC2_PORT)
- [ ] SSH key content includes BEGIN/END lines
- [ ] Server directory exists: `/home/ubuntu/csc648-fa25-03-team02`
- [ ] Git is initialized on the server
- [ ] Systemd service `tutorconnect-api` exists and is running
- [ ] Nginx is installed and configured
- [ ] You can manually SSH into the server
- [ ] You've pushed a test commit to `main` branch

