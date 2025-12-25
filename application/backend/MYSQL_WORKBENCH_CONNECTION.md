# Connect MySQL Workbench to AWS Server Database

This guide shows you how to connect MySQL Workbench to the database on your AWS server.

## Connection Information

- **Server IP:** `3.132.193.62`
- **SSH Username:** `ubuntu`
- **SSH Key:** `csc648-team02-key.pem` (in `credentials/` folder)
- **Database Name:** `csc648_tutoring_platform`
- **Database User:** `app_user`
- **Database Password:** `team02db`
- **Database Port:** `3306` (on server, accessed via SSH tunnel)

## Method 1: Using MySQL Workbench Built-in SSH Tunnel (Recommended)

This is the easiest method - MySQL Workbench handles the SSH tunnel for you.

### Step 1: Locate Your SSH Key

The SSH key should be in: `credentials/csc648-team02-key.pem`

**On Windows, you need the full path:**
```
C:\Users\ranji\CSC 648\csc648-fa25-03-team02\credentials\csc648-team02-key.pem
```

### Step 2: Open MySQL Workbench

1. Launch MySQL Workbench
2. Click the **"+"** icon next to "MySQL Connections" to create a new connection
   - Or go to: **Database → Manage Connections → New**

### Step 3: Configure Connection

Fill in the following settings:

#### Connection Settings Tab:
- **Connection Name:** `CSC648 AWS Server`
- **Connection Method:** Select `Standard TCP/IP over SSH`

#### SSH Settings (SSH Login Based):
- **SSH Hostname:** `3.132.193.62`
- **SSH Username:** `ubuntu`
- **SSH Key File:** Click the folder icon and browse to:
  ```
  C:\Users\ranji\CSC 648\csc648-fa25-03-team02\credentials\csc648-team02-key.pem
  ```
- **SSH Password:** Leave blank (using key file)
- **SSH Port:** `22` (default)

#### MySQL Settings:
- **MySQL Hostname:** `127.0.0.1` (localhost on the server)
- **MySQL Server Port:** `3306`
- **Username:** `app_user`
- **Password:** `team02db`
- **Default Schema:** `csc648_tutoring_platform`

### Step 4: Test Connection

1. Click **"Test Connection"** button
2. You should see: **"Successfully made the MySQL connection"**
3. If it fails, see Troubleshooting section below

### Step 5: Save and Connect

1. Click **"OK"** to save the connection
2. Double-click the connection name to connect
3. You should now see the database schema and tables

## Method 2: Using Manual SSH Tunnel (Alternative)

If Method 1 doesn't work, you can create an SSH tunnel manually.

### Step 1: Create SSH Tunnel in Terminal

Open PowerShell or Terminal and run:

```powershell
cd "C:\Users\ranji\CSC 648\csc648-fa25-03-team02"
ssh -i credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62
```

**Important:** 
- Keep this terminal window open (don't close it)
- The `-N` flag means "no commands", just forward the port
- The `-L 3307:127.0.0.1:3306` maps local port 3307 to server's port 3306

### Step 2: Configure MySQL Workbench

1. Open MySQL Workbench
2. Create new connection: Click **"+"** icon
3. Configure as follows:

#### Connection Settings:
- **Connection Name:** `CSC648 AWS (Tunnel)`
- **Connection Method:** `Standard (TCP/IP)`
- **Hostname:** `127.0.0.1`
- **Port:** `3307` (the local port from SSH tunnel)
- **Username:** `app_user`
- **Password:** `team02db`
- **Default Schema:** `csc648_tutoring_platform`

### Step 3: Test and Connect

1. Click **"Test Connection"**
2. If successful, save and connect
3. **Remember:** Keep the SSH tunnel terminal open while using MySQL Workbench

## Troubleshooting

### Issue: "Could not connect to SSH server"

**Solutions:**
1. **Check SSH key permissions (Windows):**
   - Right-click the `.pem` file → Properties → Security
   - Make sure your user has "Read" permissions
   - Remove "Inherit from parent" if needed and set permissions manually

2. **Check if SSH key path is correct:**
   - Use the full absolute path to the key file
   - Avoid spaces in path if possible (or use quotes)

3. **Test SSH connection manually:**
   ```powershell
   ssh -i credentials/csc648-team02-key.pem ubuntu@3.132.193.62
   ```
   If this fails, the SSH key might be corrupted or permissions are wrong

### Issue: "Access denied for user 'app_user'"

**Solutions:**
1. **Double-check credentials:**
   - Username: `app_user` (not `root`)
   - Password: `team02db`

2. **Verify database name:**
   - Database: `csc648_tutoring_platform` (not `csc648_tutoring_platform_dev`)

### Issue: "Can't connect to MySQL server on '127.0.0.1'"

**Solutions:**
1. **For Method 1 (Built-in SSH):**
   - Make sure MySQL Hostname is `127.0.0.1` (not the server IP)
   - MySQL Port should be `3306`

2. **For Method 2 (Manual tunnel):**
   - Make sure the SSH tunnel is running in terminal
   - Check that you're using port `3307` (local) not `3306`
   - Verify tunnel is active: `netstat -an | findstr 3307`

### Issue: "SSH Key File not found"

**Solutions:**
1. **Verify key file exists:**
   ```powershell
   Test-Path "C:\Users\ranji\CSC 648\csc648-fa25-03-team02\credentials\csc648-team02-key.pem"
   ```

2. **Use full path in Workbench:**
   - Don't use relative paths
   - Copy the full absolute path from File Explorer

### Issue: "Connection timeout"

**Solutions:**
1. **Check AWS security group:**
   - Port 22 (SSH) must be open
   - Verify your IP is allowed

2. **Check if server is running:**
   ```powershell
   ping 3.132.193.62
   ```

3. **Try Method 2 (manual tunnel)** if Method 1 times out

## Quick Connection Checklist

- [ ] SSH key file exists: `credentials/csc648-team02-key.pem`
- [ ] MySQL Workbench installed
- [ ] Connection configured with correct settings
- [ ] SSH tunnel active (if using Method 2)
- [ ] Test connection successful
- [ ] Can see database schema and tables

## Connection Settings Summary

### Method 1 (Built-in SSH):
```
Connection Method: Standard TCP/IP over SSH
SSH Hostname: 3.132.193.62
SSH Username: ubuntu
SSH Key: [path to csc648-team02-key.pem]
MySQL Hostname: 127.0.0.1
MySQL Port: 3306
Username: app_user
Password: team02db
Database: csc648_tutoring_platform
```

### Method 2 (Manual Tunnel):
```
Connection Method: Standard (TCP/IP)
Hostname: 127.0.0.1
Port: 3307
Username: app_user
Password: team02db
Database: csc648_tutoring_platform
(SSH tunnel must be running separately)
```

## Security Notes

1. **Never commit SSH keys to git** - They're already in `.gitignore`
2. **Use strong passwords** - The database password is `team02db`
3. **Keep SSH tunnel secure** - Don't share your SSH key
4. **Close connections** when done

## Next Steps

Once connected:
1. Explore the database schema
2. View tables: users, tutor_profiles, subjects, courses, etc.
3. Run queries to inspect data
4. Use for debugging and development

## Need Help?

- Check `credentials/README.md` for server access info
- Verify SSH key permissions
- Test SSH connection manually first
- Try both methods to see which works best for you



