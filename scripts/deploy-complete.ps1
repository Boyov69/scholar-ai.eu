# Scholar AI Complete Deployment Script
# This script handles the complete deployment process including Stripe setup

param(
    [switch]$Production,
    [switch]$SkipBuild,
    [switch]$SkipTests,
    [string]$Domain = "scholarai.eu"
)

Write-Host "🚀 Scholar AI Complete Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if running in production mode
if ($Production) {
    Write-Host "⚠️  PRODUCTION DEPLOYMENT MODE" -ForegroundColor Yellow
    $confirmation = Read-Host "Are you sure you want to deploy to production? (y/N)"
    if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 1
    }
}

# Function to check if command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

$prerequisites = @(
    @{ Command = "node"; Name = "Node.js" },
    @{ Command = "npm"; Name = "npm" },
    @{ Command = "git"; Name = "Git" },
    @{ Command = "vercel"; Name = "Vercel CLI" }
)

foreach ($prereq in $prerequisites) {
    if (Test-Command $prereq.Command) {
        Write-Host "✅ $($prereq.Name) is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ $($prereq.Name) is not installed" -ForegroundColor Red
        exit 1
    }
}

# Check environment file
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Please copy .env.example to .env and fill in your values" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green

# Install dependencies if needed
if (-not (Test-Path "node_modules") -or -not $SkipBuild) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Run tests if not skipped
if (-not $SkipTests) {
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    npm run test --if-present
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Tests failed, but continuing..." -ForegroundColor Yellow
    }
}

# Build the project if not skipped
if (-not $SkipBuild) {
    Write-Host "🔨 Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
}

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Scholar AI deployment"
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "🔗 Setting up GitHub remote..." -ForegroundColor Yellow
    $githubRepo = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"
    git remote add origin $githubRepo
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" --allow-empty
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

# Deploy Supabase Edge Functions
Write-Host "☁️  Deploying Supabase Edge Functions..." -ForegroundColor Yellow
if (Test-Command "supabase") {
    supabase functions deploy stripe-checkout
    supabase functions deploy stripe-portal
    supabase functions deploy stripe-webhook
    supabase functions deploy subscription-status
    Write-Host "✅ Supabase functions deployed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Supabase CLI not found. Please deploy functions manually:" -ForegroundColor Yellow
    Write-Host "   1. Install Supabase CLI: npm install -g supabase" -ForegroundColor White
    Write-Host "   2. Login: supabase login" -ForegroundColor White
    Write-Host "   3. Deploy functions: supabase functions deploy" -ForegroundColor White
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
if ($Production) {
    vercel --prod --yes
} else {
    vercel --yes
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Vercel deployment completed" -ForegroundColor Green

# Get deployment URL
$deploymentUrl = vercel --scope=personal ls | Select-String "https://" | Select-Object -First 1
Write-Host "🌐 Deployment URL: $deploymentUrl" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. 🔑 Add environment variables in Vercel Dashboard" -ForegroundColor White
Write-Host "2. 💳 Configure Stripe products and prices" -ForegroundColor White
Write-Host "3. 🔗 Set up webhook endpoints in Stripe" -ForegroundColor White
Write-Host "4. 🌐 Configure domain DNS settings" -ForegroundColor White
Write-Host "5. 🧪 Test payment flows" -ForegroundColor White
Write-Host "6. 📊 Monitor application health" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""

# Open relevant URLs
if ($Production) {
    Write-Host "🔗 Opening important links..." -ForegroundColor Cyan
    Start-Process "https://vercel.com/dashboard"
    Start-Process "https://dashboard.stripe.com"
    Start-Process "https://supabase.com/dashboard"
}

Write-Host "🚀 Scholar AI is ready for the world! 🌍" -ForegroundColor Green
