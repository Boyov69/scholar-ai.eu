# Scholar AI - Git Setup Script
# This script will set up your Git repository and push to GitHub

Write-Host "🚀 Setting up Git for Scholar AI" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Navigate to project directory
Set-Location "E:\User\Documents\scholar-ai"

# Initialize git if not already done
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Check if .gitignore exists, if not create it
if (-not (Test-Path ".gitignore")) {
    Write-Host "📄 Creating .gitignore file..." -ForegroundColor Yellow
    @"
# Dependencies
node_modules/
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.production

# Build output
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Misc
*.swp
*.swo
*~
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}

# Add all files
Write-Host "📁 Adding files to Git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Scholar AI - Europe's Premier Academic Research Platform"

# Add GitHub remote
Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null  # Remove if exists
git remote add origin https://github.com/Boyov69/scholar-ai.git

# Set main branch
git branch -M main

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for your GitHub credentials" -ForegroundColor White
git push -u origin main

Write-Host ""
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host "Your code is now on GitHub at: https://github.com/Boyov69/scholar-ai" -ForegroundColor Cyan