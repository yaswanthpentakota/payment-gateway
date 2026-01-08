Write-Host "=== Payment Gateway Startup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if database is running
Write-Host "1. Checking PostgreSQL database..." -ForegroundColor Yellow
$dbContainer = docker ps --filter "name=pg_gateway" --format "{{.Names}}"
if ($dbContainer -eq "pg_gateway") {
    Write-Host "   ✅ Database is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ Database is not running. Starting it..." -ForegroundColor Red
    docker-compose up -d postgres
    Write-Host "   Waiting 10 seconds for database to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "2. Starting Backend Server..." -ForegroundColor Yellow
Write-Host "   Backend will run on http://localhost:8000" -ForegroundColor Gray
Write-Host ""

# Navigate to backend and start
Set-Location backend
npm start
