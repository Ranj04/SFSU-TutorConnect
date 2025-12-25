# MySQL Workbench Quick Setup - AWS Server

## Quick Steps (Method 1 - Recommended)

### 1. Open MySQL Workbench
- Launch MySQL Workbench
- Click **"+"** next to "MySQL Connections"

### 2. Fill in Connection Details

**Connection Name:** `CSC648 AWS Server`

**Connection Method:** `Standard TCP/IP over SSH`

**SSH Settings:**
- **SSH Hostname:** `3.132.193.62`
- **SSH Username:** `ubuntu`
- **SSH Key File:** Browse to your `.pem` file
  - Expected location: `credentials/csc648-team02-key.pem`
  - Or wherever your team stores the SSH key
- **SSH Password:** (leave blank)

**MySQL Settings:**
- **MySQL Hostname:** `127.0.0.1`
- **MySQL Server Port:** `3306`
- **Username:** `app_user`
- **Password:** `team02db`
- **Default Schema:** `csc648_tutoring_platform`

### 3. Test & Connect
- Click **"Test Connection"**
- If successful, click **"OK"** to save
- Double-click connection to connect

## Visual Guide

```
MySQL Workbench Connection Setup
┌─────────────────────────────────────────┐
│ Connection Name: CSC648 AWS Server      │
│ Connection Method: Standard TCP/IP      │
│                    over SSH             │
├─────────────────────────────────────────┤
│ SSH Configuration:                      │
│   SSH Hostname: 3.132.193.62            │
│   SSH Username: ubuntu                  │
│   SSH Key File: [Browse...]             │
│   SSH Password: (leave blank)           │
├─────────────────────────────────────────┤
│ MySQL Configuration:                    │
│   MySQL Hostname: 127.0.0.1             │
│   MySQL Server Port: 3306               │
│   Username: app_user                    │
│   Password: team02db                    │
│   Default Schema: csc648_tutoring_...   │
└─────────────────────────────────────────┘
```

## If SSH Key is Missing

If you don't have the SSH key file:

1. **Check with your team** - Someone should have `csc648-team02-key.pem`
2. **Check other locations:**
   - Desktop
   - Downloads folder
   - Team shared drive
3. **Check git** - Key might be stored securely elsewhere
4. **Contact team lead** - They can provide the key

## Common Issues

| Issue | Solution |
|-------|----------|
| "SSH key not found" | Get key from team or check other locations |
| "Access denied" | Verify username: `app_user`, password: `team02db` |
| "Can't connect" | Check MySQL Hostname is `127.0.0.1` (not server IP) |
| "Timeout" | Verify server IP is correct: `3.132.193.62` |

## Alternative: Manual SSH Tunnel

If built-in SSH doesn't work:

1. **Open PowerShell:**
   ```powershell
   ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
   ```

2. **In MySQL Workbench:**
   - Connection Method: `Standard (TCP/IP)`
   - Hostname: `127.0.0.1`
   - Port: `3307`
   - Username: `app_user`
   - Password: `team02db`

3. **Keep PowerShell window open** while using Workbench

## Full Details

See `MYSQL_WORKBENCH_CONNECTION.md` for complete troubleshooting guide.



