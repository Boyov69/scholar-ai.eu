# Scholar AI Quick Deployment Script
# Run this script with: .\deploy.ps1

Write-Host "🚀 Scholar AI Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found! Please create it first." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git..." -ForegroundColor Yellow
    git init
}

# Add files to git
Write-Host "📁 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit changes
$commitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

# Check if remote origin exists
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "⚠️  No Git remote found!" -ForegroundColor Yellow
    Write-Host "Please add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/scholar-ai.git" -ForegroundColor White
    Write-Host ""
    $githubUrl = Read-Host "Enter your GitHub repository URL"
    if ($githubUrl) {
        git remote add origin $githubUrl
    } else {
        Write-Host "❌ GitHub URL required for deployment" -ForegroundColor Red
        exit 1
    }
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

# Deploy to Vercel
Write-Host "☁️  Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "2. Configure your Squarespace domain" -ForegroundColor White
Write-Host "3. Test all functionalities" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Yellow