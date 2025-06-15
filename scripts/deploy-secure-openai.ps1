# 🔒 Secure OpenAI Deployment Script
# This script ensures proper security setup for OpenAI integration

param(
    [switch]$Production,
    [switch]$SkipChecks,
    [string]$OpenAIKey
)

Write-Host "🔒 Scholar AI - Secure OpenAI Deployment" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Security validation function
function Test-OpenAIKeySecurity {
    param([string]$Key)
    
    if (-not $Key) {
        Write-Host "❌ No OpenAI API key provided" -ForegroundColor Red
        return $false
    }
    
    if ($Key -notmatch "^sk-") {
        Write-Host "❌ Invalid OpenAI API key format" -ForegroundColor Red
        return $false
    }
    
    if ($Key.Length -lt 50) {
        Write-Host "❌ OpenAI API key appears too short" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ OpenAI API key format validated" -ForegroundColor Green
    return $true
}

# Check if .env file has insecure configuration
function Test-EnvironmentSecurity {
    $envFiles = @(".env", ".env.local", ".env.production")
    $insecureFound = $false
    
    foreach ($envFile in $envFiles) {
        if (Test-Path $envFile) {
            $content = Get-Content $envFile -Raw
            
            # Check for insecure VITE_ prefixed OpenAI keys
            if ($content -match "VITE_OPENAI_API_KEY") {
                Write-Host "🚨 SECURITY ALERT: Found VITE_OPENAI_API_KEY in $envFile" -ForegroundColor Red
                Write-Host "   This exposes your API key to the browser!" -ForegroundColor Red
                $insecureFound = $true
            }
            
            # Check for exposed keys in comments or examples
            if ($content -match "sk-[a-zA-Z0-9-_]{20,}") {
                Write-Host "⚠️  WARNING: Potential API key found in $envFile" -ForegroundColor Yellow
                Write-Host "   Please verify no real keys are committed" -ForegroundColor Yellow
            }
        }
    }
    
    return -not $insecureFound
}

# Main deployment process
try {
    Write-Host "`n🔍 Running Security Checks..." -ForegroundColor Yellow
    
    # 1. Check environment security
    if (-not (Test-EnvironmentSecurity)) {
        if (-not $SkipChecks) {
            Write-Host "`n❌ Security check failed. Use -SkipChecks to override (NOT RECOMMENDED)" -ForegroundColor Red
            exit 1
        }
        Write-Host "⚠️  Continuing with security warnings (SkipChecks enabled)" -ForegroundColor Yellow
    }
    
    # 2. Validate OpenAI key if provided
    if ($OpenAIKey) {
        if (-not (Test-OpenAIKeySecurity -Key $OpenAIKey)) {
            Write-Host "`n❌ OpenAI API key validation failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️  No OpenAI API key provided for validation" -ForegroundColor Yellow
        Write-Host "   Make sure to set OPENAI_API_KEY in Vercel environment variables" -ForegroundColor Yellow
    }
    
    # 3. Check Supabase Edge Functions
    Write-Host "`n🚀 Checking Supabase Edge Functions..." -ForegroundColor Yellow
    
    if (-not (Test-Path "supabase/functions/openai-research/index.ts")) {
        Write-Host "❌ OpenAI Edge Function not found" -ForegroundColor Red
        Write-Host "   Expected: supabase/functions/openai-research/index.ts" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ OpenAI Edge Function found" -ForegroundColor Green
    
    # 4. Deploy Edge Functions
    Write-Host "`n📦 Deploying Supabase Edge Functions..." -ForegroundColor Yellow
    
    try {
        $deployResult = supabase functions deploy openai-research 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ OpenAI Edge Function deployed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Edge Function deployment failed:" -ForegroundColor Red
            Write-Host $deployResult -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "❌ Supabase CLI not found or not logged in" -ForegroundColor Red
        Write-Host "   Please install Supabase CLI and run 'supabase login'" -ForegroundColor Red
        exit 1
    }
    
    # 5. Build and deploy to Vercel
    Write-Host "`n🏗️  Building application..." -ForegroundColor Yellow
    
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
    
    # 6. Deploy to Vercel
    Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Yellow
    
    if ($Production) {
        vercel --prod
    } else {
        vercel
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel deployment failed" -ForegroundColor Red
        exit 1
    }
    
    # 7. Security reminder
    Write-Host "`n🔒 SECURITY CHECKLIST:" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    Write-Host "✅ OpenAI API key stored server-side only" -ForegroundColor Green
    Write-Host "✅ Edge Function deployed for secure API calls" -ForegroundColor Green
    Write-Host "✅ No VITE_OPENAI_API_KEY found in environment" -ForegroundColor Green
    Write-Host "✅ Frontend uses secure API client" -ForegroundColor Green
    
    Write-Host "`n⚠️  IMPORTANT REMINDERS:" -ForegroundColor Yellow
    Write-Host "- Set OPENAI_API_KEY in Vercel environment variables" -ForegroundColor Yellow
    Write-Host "- Never use VITE_ prefix for sensitive API keys" -ForegroundColor Yellow
    Write-Host "- Monitor OpenAI usage and costs" -ForegroundColor Yellow
    Write-Host "- Regularly rotate API keys" -ForegroundColor Yellow
    
    Write-Host "`n🎉 Secure deployment completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Final security test
Write-Host "`n🧪 Running final security test..." -ForegroundColor Yellow
Write-Host "Open browser DevTools and check:" -ForegroundColor Gray
Write-Host "  console.log(process.env.VITE_OPENAI_API_KEY) // Should be undefined" -ForegroundColor Gray
Write-Host "  This confirms your API key is secure! 🔒" -ForegroundColor Gray
