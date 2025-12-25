# Script to switch .env to use local database
# Run this: .\switch-to-local-db.ps1

Write-Host "Switching to LOCAL database for testing..." -ForegroundColor Yellow

$envFile = ".env"
$newContent = @"
# Local Database Configuration (for testing)
# This uses your local MySQL database - changes stay on your computer

DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/csc648_tutoring_platform_dev

API_ENV=development
API_DEBUG=True
"@

Write-Host ""
Write-Host "Please enter your local MySQL root password:" -ForegroundColor Cyan
$password = Read-Host "Password" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$newContent = $newContent -replace "YOUR_PASSWORD", $plainPassword
$newContent | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✓ .env file updated to use LOCAL database!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MySQL is running locally"
Write-Host "2. Create the database in MySQL Workbench:"
Write-Host "   CREATE DATABASE csc648_tutoring_platform_dev;"
Write-Host "3. Run: python setup_db.py"
Write-Host "4. Run: python test_db_connection.py"
Write-Host "5. Start backend: uvicorn app.main:app --reload"

