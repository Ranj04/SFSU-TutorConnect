# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

## Server Access (AWS EC2)
- **Server IP:** 3.132.193.62
- **SSH Username:** ubuntu
- **SSH Key:** csc648-team02-key.pem (stored in `credentials/` folder)

## Database Access (MySQL 8)
- **Database Name:** csc648_tutoring_platform
- **Database User:** app_user
- **Database Password:** team02db
- **Database Port:** 3306 (local to server only)
- **Database Host:** 127.0.0.1 (localhost on server)

---

## Step-by-Step Instructions for Team Members

### 1. First Time Setup (One-time)
```bash
# Navigate to project folder
cd /path/to/csc648-fa25-03-team02

# Set correct permissions for SSH key (IMPORTANT!)
chmod 600 credentials/csc648-team02-key.pem
```

### 2. How to Connect to Server
```bash
# Connect to server via SSH
ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62

# You should see: ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

### 3. How to Access Database from Your Local Machine

#### Option A: Using SSH Tunnel (Recommended for development)
```bash
# Step 1: Create SSH tunnel (run this in a separate terminal, keep it open)
ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62

# Step 2: Connect to MySQL through the tunnel (choose one)

# 2A) Using MySQL CLI
mysql -h 127.0.0.1 -P 3307 -u app_user -p csc648_tutoring_platform
# Then enter the password when prompted

# 2B) Quick connection test (no login)
nc -vz 127.0.0.1 3307   # should report 'succeeded'

# 2C) From application code (see detailed DSN example below)
# mysql+pymysql://app_user:<PASSWORD>@127.0.0.1:3307/csc648_tutoring_platform
```

#### Option B: Connect to Database from Server
```bash
# First SSH into server
# Then connect to MySQL from server
mysql -u app_user -p csc648_tutoring_platform
# Enter password when prompted
```

### 4. MySQL Workbench Setup (GUI Option)

#### Option A: Using MySQL Workbench with SSH Tunnel (Alternative Method)
1. **Open MySQL Workbench** and click "Setup New Connection"

2. **Configure SSH tunnel directly in Workbench:**
   - **Connection Name:** `CSC648 Tutoring Platform (SSH)`
   - **Connection Method:** `Standard TCP/IP over SSH`
   - **SSH Hostname:** `3.132.193.62`
   - **SSH Username:** `ubuntu`
   - **SSH Key File:** Browse to `credentials/csc648-team02-key.pem`
   - **MySQL Hostname:** `127.0.0.1`
   - **MySQL Server Port:** `3306`
   - **Username:** `app_user`
   - **Password:** `team02db`
   - **Default Schema:** `csc648_tutoring_platform`

3. **Test Connection** - should show "Successfully made the MySQL connection"

#### Option B: Using MySQL Workbench with SSH Tunnel
1. **First, create SSH tunnel** (run this in terminal, keep it open):
   ```bash
   ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
   ```

2. **Open MySQL Workbench** and click "Setup New Connection"

3. **Configure the connection:**
   - **Connection Name:** `CSC648 Tutoring Platform`
   - **Connection Method:** `Standard (TCP/IP)`
   - **Hostname:** `127.0.0.1`
   - **Port:** `3307`
   - **Username:** `app_user`
   - **Password:** `[Store in Vault...] team02db`
   - **Default Schema:** `csc648_tutoring_platform`

4. **Test Connection** - should show "Successfully made the MySQL connection"

### 4. For Developers: Database Connection in Code
```python
# FastAPI/SQLAlchemy connection string
DATABASE_URL = "mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform"
# Note: Use port 3307 when connecting from local machine via SSH tunnel
# Use port 3306 when connecting from the server itself
```


# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
