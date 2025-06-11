# Scholar AI Localhost Development Setup Script
# This script sets up a complete local development environment

param(
    [switch]$SkipInstall,
    [switch]$ResetDatabase,
    [string]$Port = "5173"
)

Write-Host "🏠 Scholar AI Localhost Setup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

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
    @{ Command = "node"; Name = "Node.js"; Required = $true },
    @{ Command = "npm"; Name = "npm"; Required = $true },
    @{ Command = "git"; Name = "Git"; Required = $true },
    @{ Command = "supabase"; Name = "Supabase CLI"; Required = $false }
)

foreach ($prereq in $prerequisites) {
    if (Test-Command $prereq.Command) {
        Write-Host "✅ $($prereq.Name) is installed" -ForegroundColor Green
    } else {
        if ($prereq.Required) {
            Write-Host "❌ $($prereq.Name) is required but not installed" -ForegroundColor Red
            exit 1
        } else {
            Write-Host "⚠️  $($prereq.Name) is not installed (optional)" -ForegroundColor Yellow
        }
    }
}

# Install Supabase CLI if not present
if (-not (Test-Command "supabase")) {
    Write-Host "📦 Installing Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
}

# Create local environment file
Write-Host "📝 Setting up local environment..." -ForegroundColor Yellow

$localEnvContent = @"
# Scholar AI Local Development Environment
# This file is for localhost testing only

# ================================
# LOCAL DEVELOPMENT SETTINGS
# ================================
NODE_ENV=development
VITE_APP_ENV=development
VITE_DEV_MODE=true

# ================================
# SUPABASE LOCAL CONFIGURATION
# ================================
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# ================================
# STRIPE TEST CONFIGURATION
# ================================
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
VITE_STRIPE_WEBHOOK_SECRET=whsec_test_1234567890abcdef

# Test Price IDs (will be created by setup script)
VITE_STRIPE_PRICE_ADVANCED_MONTHLY=price_test_advanced_monthly
VITE_STRIPE_PRICE_ADVANCED_YEARLY=price_test_advanced_yearly
VITE_STRIPE_PRICE_ULTRA_MONTHLY=price_test_ultra_monthly
VITE_STRIPE_PRICE_ULTRA_YEARLY=price_test_ultra_yearly
VITE_STRIPE_PRICE_PHD_MONTHLY=price_test_phd_monthly
VITE_STRIPE_PRICE_PHD_YEARLY=price_test_phd_yearly

# ================================
# FUTUREHOUSE API (MOCK FOR LOCAL)
# ================================
VITE_FUTUREHOUSE_API_KEY=mock-api-key-for-local-testing

# ================================
# LOCAL DEVELOPMENT FLAGS
# ================================
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_PERFORMANCE_MONITORING=false
VITE_MOCK_PAYMENTS=true
VITE_MOCK_AI_RESPONSES=true

# ================================
# LOCALHOST SETTINGS
# ================================
VITE_APP_URL=http://localhost:$Port
VITE_API_URL=http://localhost:54321
VITE_CORS_ORIGINS=http://localhost:$Port,http://127.0.0.1:$Port

# ================================
# DEVELOPMENT TOOLS
# ================================
VITE_SHOW_DEV_TOOLS=true
VITE_ENABLE_DEBUG_LOGS=true
VITE_HOT_RELOAD=true
"@

# Write local environment file
$localEnvContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Local environment file created (.env.local)" -ForegroundColor Green

# Install dependencies if not skipped
if (-not $SkipInstall) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Initialize Supabase local development
Write-Host "🗄️  Setting up local Supabase..." -ForegroundColor Yellow

# Check if supabase is already initialized
if (-not (Test-Path "supabase/config.toml")) {
    supabase init
}

# Start Supabase local development
Write-Host "🚀 Starting Supabase local services..." -ForegroundColor Yellow
Start-Process -FilePath "supabase" -ArgumentList "start" -NoNewWindow -Wait

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Supabase local services started" -ForegroundColor Green
} else {
    Write-Host "⚠️  Supabase services may already be running" -ForegroundColor Yellow
}

# Apply database schema
if ($ResetDatabase -or -not (Test-Path "supabase/.branches")) {
    Write-Host "📋 Applying database schema..." -ForegroundColor Yellow
    supabase db reset
    Write-Host "✅ Database schema applied" -ForegroundColor Green
}

# Deploy Edge Functions locally
Write-Host "⚡ Deploying Edge Functions locally..." -ForegroundColor Yellow
supabase functions serve --no-verify-jwt

Write-Host ""
Write-Host "🎉 LOCALHOST SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Local URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:$Port" -ForegroundColor White
Write-Host "   Supabase Studio: http://localhost:54323" -ForegroundColor White
Write-Host "   Supabase API: http://localhost:54321" -ForegroundColor White
Write-Host "   Edge Functions: http://localhost:54321/functions/v1" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Email: test@localhost.dev" -ForegroundColor White
Write-Host "   Password: TestPassword123!" -ForegroundColor White
Write-Host ""
Write-Host "💳 Test Stripe Cards:" -ForegroundColor Cyan
Write-Host "   Success: 4242 4242 4242 4242" -ForegroundColor White
Write-Host "   Decline: 4000 0000 0000 0002" -ForegroundColor White
Write-Host "   3D Secure: 4000 0025 0000 3155" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to start development!" -ForegroundColor Green
Write-Host "   Run: npm run dev" -ForegroundColor Yellow
Write-Host ""
