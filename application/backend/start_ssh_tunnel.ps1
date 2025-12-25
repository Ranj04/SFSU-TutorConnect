# SSH Tunnel Helper Script for MySQL Workbench
# This script creates an SSH tunnel to the AWS server for database access

$sshKeyPath = Join-Path $PSScriptRoot "..\credentials\csc648-team02-key.pem"
$serverIP = "3.132.193.62"
$serverUser = "ubuntu"
$localPort = "3307"
$remoteHost = "127.0.0.1"
$remotePort = "3306"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SSH Tunnel for MySQL Workbench" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Check if SSH key exists
if (-not (Test-Path $sshKeyPath)) {
    Write-Host "`n[ERROR] SSH key not found at: $sshKeyPath" -ForegroundColor Red
    Write-Host "`nPlease check:" -ForegroundColor Yellow
    Write-Host "  1. SSH key exists in credentials folder" -ForegroundColor Yellow
    Write-Host "  2. Key file is named: csc648-team02-key.pem" -ForegroundColor Yellow
    Write-Host "  3. Get key from team if missing" -ForegroundColor Yellow
    Write-Host "`nAlternative: Use MySQL Workbench built-in SSH (see MYSQL_WORKBENCH_CONNECTION.md)" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n[INFO] SSH Key found: $sshKeyPath" -ForegroundColor Green
Write-Host "`n[INFO] Creating SSH tunnel..." -ForegroundColor Yellow
Write-Host "  Local Port: $localPort" -ForegroundColor Gray
Write-Host "  Remote: $remoteHost`:$remotePort" -ForegroundColor Gray
Write-Host "  Server: $serverUser@$serverIP" -ForegroundColor Gray

Write-Host "`n[INFO] Tunnel will forward:" -ForegroundColor Cyan
Write-Host "  localhost:$localPort -> $serverIP:$remotePort (via SSH)" -ForegroundColor Gray

Write-Host "`n[IMPORTANT] Keep this window open while using MySQL Workbench!" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop the tunnel" -ForegroundColor Yellow

Write-Host "`n[INFO] MySQL Workbench Settings:" -ForegroundColor Cyan
Write-Host "  Connection Method: Standard (TCP/IP)" -ForegroundColor Gray
Write-Host "  Hostname: 127.0.0.1" -ForegroundColor Gray
Write-Host "  Port: $localPort" -ForegroundColor Gray
Write-Host "  Username: app_user" -ForegroundColor Gray
Write-Host "  Password: team02db" -ForegroundColor Gray
Write-Host "  Database: csc648_tutoring_platform" -ForegroundColor Gray

Write-Host "`n[INFO] Starting tunnel..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Create SSH tunnel
ssh -i $sshKeyPath -N -L "${localPort}:${remoteHost}:${remotePort}" "${serverUser}@${serverIP}"

# If tunnel closes
Write-Host "`n[INFO] SSH tunnel closed" -ForegroundColor Yellow



