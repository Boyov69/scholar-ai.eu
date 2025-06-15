# 🔧 Scholar AI - Fix 401 Errors Script
# This script fixes the most common causes of 401 errors

param(
    [switch]$SkipSupabase,
    [switch]$TestOnly
)

Write-Host "🔧 Scholar AI - Fix 401 Errors" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Function to test environment variables
function Test-EnvironmentVariables {
    Write-Host "`n🔍 Testing Environment Variables..." -ForegroundColor Yellow
    
    $envFile = ".env"
    if (-not (Test-Path $envFile)) {
        Write-Host "❌ .env file not found!" -ForegroundColor Red
        return $false
    }
    
    $envContent = Get-Content $envFile -Raw
    $issues = @()
    
    # Check for required VITE_ variables
    $requiredVars = @(
        "VITE_SUPABASE_URL",
        "VITE_SUPABASE_ANON_KEY",
        "VITE_STRIPE_PUBLISHABLE_KEY",
        "VITE_FUTUREHOUSE_API_KEY"
    )
    
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=.+") {
            $issues += "Missing or empty: $var"
        } else {
            Write-Host "✅ $var found" -ForegroundColor Green
        }
    }
    
    # Check for security issues
    $securityIssues = @(
        "VITE_OPENAI_API_KEY",
        "VITE_STRIPE_SECRET_KEY",
        "VITE_SUPABASE_SERVICE_ROLE_KEY"
    )
    
    foreach ($var in $securityIssues) {
        if ($envContent -match "$var=.+") {
            $issues += "🚨 SECURITY RISK: $var should not have VITE_ prefix!"
        }
    }
    
    if ($issues.Count -gt 0) {
        Write-Host "`n❌ Environment Issues Found:" -ForegroundColor Red
        foreach ($issue in $issues) {
            Write-Host "  • $issue" -ForegroundColor Red
        }
        return $false
    }
    
    Write-Host "✅ Environment variables look good!" -ForegroundColor Green
    return $true
}

# Function to test Supabase connection
function Test-SupabaseConnection {
    Write-Host "`n🔍 Testing Supabase Connection..." -ForegroundColor Yellow
    
    try {
        # Run the environment test script
        $result = node scripts/test-environment.js 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Environment test passed!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Environment test failed:" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "⚠️  Could not run environment test (Node.js required)" -ForegroundColor Yellow
        return $true # Don't fail if Node.js test can't run
    }
}

# Function to fix common issues
function Fix-CommonIssues {
    Write-Host "`n🔧 Applying Common Fixes..." -ForegroundColor Yellow
    
    # 1. Restart development server
    Write-Host "🔄 Restarting development server..." -ForegroundColor Gray
    
    # Kill any existing Vite processes
    try {
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force
        Write-Host "✅ Stopped existing Vite processes" -ForegroundColor Green
    } catch {
        Write-Host "ℹ️  No existing Vite processes found" -ForegroundColor Gray
    }
    
    # 2. Clear Node modules cache
    Write-Host "🧹 Clearing Node.js cache..." -ForegroundColor Gray
    if (Test-Path "node_modules/.vite") {
        Remove-Item "node_modules/.vite" -Recurse -Force
        Write-Host "✅ Cleared Vite cache" -ForegroundColor Green
    }
    
    # 3. Reinstall dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Gray
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        }
    }
}

# Function to provide Supabase RLS fix suggestions
function Show-SupabaseRLSFixes {
    Write-Host "`n🔒 Supabase RLS (Row Level Security) Fixes:" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    
    Write-Host "`n📝 Option 1: Disable RLS temporarily (for testing)" -ForegroundColor Yellow
    Write-Host "Go to Supabase Dashboard → SQL Editor and run:" -ForegroundColor Gray
    Write-Host @"
-- Disable RLS for testing (NOT for production!)
ALTER TABLE research_queries DISABLE ROW LEVEL SECURITY;
ALTER TABLE citations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
"@ -ForegroundColor White
    
    Write-Host "`n📝 Option 2: Create proper RLS policies" -ForegroundColor Yellow
    Write-Host "Go to Supabase Dashboard → SQL Editor and run:" -ForegroundColor Gray
    Write-Host @"
-- Enable RLS and create policies
ALTER TABLE research_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to access their own data
CREATE POLICY "Users can access own research_queries" ON research_queries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own citations" ON citations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);
"@ -ForegroundColor White
    
    Write-Host "`n🌐 Supabase Dashboard URL:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/xicjnnzzykdhbmrpafhs" -ForegroundColor Blue
}

# Main execution
try {
    # Test environment variables
    $envOk = Test-EnvironmentVariables
    
    if (-not $envOk) {
        Write-Host "`n❌ Environment variable issues found. Please fix .env file first." -ForegroundColor Red
        exit 1
    }
    
    # Test Supabase connection
    $supabaseOk = Test-SupabaseConnection
    
    if (-not $TestOnly) {
        # Apply fixes
        Fix-CommonIssues
        
        if (-not $SkipSupabase) {
            Show-SupabaseRLSFixes
        }
    }
    
    Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
    Write-Host "==============" -ForegroundColor Cyan
    Write-Host "1. Start development server: npm run dev" -ForegroundColor White
    Write-Host "2. Open browser: http://localhost:5173" -ForegroundColor White
    Write-Host "3. Check browser console for any remaining errors" -ForegroundColor White
    Write-Host "4. Test authentication and data operations" -ForegroundColor White
    
    if (-not $supabaseOk) {
        Write-Host "`n⚠️  If 401 errors persist:" -ForegroundColor Yellow
        Write-Host "• Check Supabase RLS policies (see suggestions above)" -ForegroundColor White
        Write-Host "• Verify user authentication is working" -ForegroundColor White
        Write-Host "• Check browser network tab for detailed error messages" -ForegroundColor White
    }
    
    Write-Host "`n🎉 Fix script completed!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Fix script failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
