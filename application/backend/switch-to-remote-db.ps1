# Script to switch .env to use remote database
# Run this: .\switch-to-remote-db.ps1

Write-Host "Switching to REMOTE database..." -ForegroundColor Yellow

$envFile = ".env"
$newContent = @"
# Remote Database Configuration (via SSH tunnel)
# This connects to the remote AWS database
# Make sure to start SSH tunnel first:
# ssh -i ../credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62

DATABASE_URL=mysql+pymysql://app_user:team02db@127.0.0.1:3307/csc648_tutoring_platform

API_ENV=development
API_DEBUG=True
"@

$newContent | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✓ .env file updated to use REMOTE database!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Start SSH tunnel first!" -ForegroundColor Red
Write-Host "Run this in a separate terminal:" -ForegroundColor Yellow
Write-Host "  ssh -i ../credentials/csc648-team02-key.pem -N -L 3307:127.0.0.1:3306 ubuntu@3.132.193.62"
Write-Host ""
Write-Host "Then start backend: uvicorn app.main:app --reload"

