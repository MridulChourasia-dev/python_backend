# SkillSphere Quick Start Script
# Run this script to start the application

Write-Host "🚀 Starting SkillSphere..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
}

# Start Docker Compose
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SkillSphere is starting!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access Points:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host ""
    Write-Host "⏳ Waiting for services to be ready (this may take a minute)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    Write-Host ""
    Write-Host "🎉 Ready! Open http://localhost:3000 in your browser" -ForegroundColor Green
    Write-Host ""
    Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "To stop:      docker-compose down" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Failed to start containers" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Red
}
