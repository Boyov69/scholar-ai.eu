# Scholar AI Localhost Development Startup Script
# This script starts all necessary services for local development

param(
    [switch]$Fresh,
    [switch]$SkipData,
    [string]$Port = "5173"
)

Write-Host "Starting Scholar AI Localhost Development Environment" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Function to check if port is in use
function Test-Port($port) {
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to start process in background
function Start-BackgroundProcess($name, $command, $args, $workingDir = $PWD) {
    Write-Host "Starting $name..." -ForegroundColor Yellow
    
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = $command
    $processInfo.Arguments = $args
    $processInfo.WorkingDirectory = $workingDir
    $processInfo.UseShellExecute = $false
    $processInfo.CreateNoWindow = $false
    
    $process = [System.Diagnostics.Process]::Start($processInfo)
    
    if ($process) {
        Write-Host "✅ $name started (PID: $($process.Id))" -ForegroundColor Green
        return $process
    } else {
        Write-Host "❌ Failed to start $name" -ForegroundColor Red
        return $null
    }
}

# Check if fresh start is requested
if ($Fresh) {
    Write-Host "Fresh start requested - cleaning up..." -ForegroundColor Yellow

    # Stop any running Supabase services
    try {
        supabase stop
        Write-Host "Stopped existing Supabase services" -ForegroundColor Green
    } catch {
        Write-Host "No Supabase services were running" -ForegroundColor Blue
    }

    # Clean node_modules if requested
    if (Test-Path "node_modules") {
        Write-Host "Removing node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules"
    }

    # Clean build artifacts
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
    }
}

# Check if environment is set up
if (-not (Test-Path ".env.local")) {
    Write-Host "⚙️  Setting up local environment..." -ForegroundColor Yellow
    & ".\scripts\setup-localhost.ps1" -Port $Port
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to set up localhost environment" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies if needed
if (-not (Test-Path "node_modules") -or $Fresh) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Start Supabase services
Write-Host "🗄️  Starting Supabase services..." -ForegroundColor Yellow
supabase start
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Supabase services" -ForegroundColor Red
    exit 1
}

# Wait for Supabase to be ready
Write-Host "⏳ Waiting for Supabase to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
do {
    Start-Sleep -Seconds 2
    $attempt++
    $supabaseReady = Test-Port 54321
    if ($supabaseReady) {
        Write-Host "✅ Supabase is ready!" -ForegroundColor Green
        break
    }
    Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
} while ($attempt -lt $maxAttempts)

if (-not $supabaseReady) {
    Write-Host "❌ Supabase failed to start within timeout" -ForegroundColor Red
    exit 1
}

# Create test data if not skipped
if (-not $SkipData) {
    Write-Host "🧪 Creating test data..." -ForegroundColor Yellow
    node scripts/create-test-data.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Failed to create test data, but continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Test data created successfully" -ForegroundColor Green
    }
}

# Start Edge Functions
Write-Host "⚡ Starting Edge Functions..." -ForegroundColor Yellow
$functionsProcess = Start-BackgroundProcess "Edge Functions" "supabase" "functions serve --no-verify-jwt"

# Wait a moment for functions to start
Start-Sleep -Seconds 3

# Start the development server
Write-Host "🌐 Starting development server..." -ForegroundColor Yellow
$devProcess = Start-BackgroundProcess "Dev Server" "npm" "run dev"

# Wait for dev server to be ready
Write-Host "⏳ Waiting for development server..." -ForegroundColor Yellow
$maxAttempts = 20
$attempt = 0
do {
    Start-Sleep -Seconds 2
    $attempt++
    $devReady = Test-Port $Port
    if ($devReady) {
        Write-Host "✅ Development server is ready!" -ForegroundColor Green
        break
    }
    Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
} while ($attempt -lt $maxAttempts)

# Display status
Write-Host ""
Write-Host "🎉 SCHOLAR AI LOCALHOST IS READY!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:        http://localhost:$Port" -ForegroundColor White
Write-Host "   Supabase Studio: http://localhost:54323" -ForegroundColor White
Write-Host "   Supabase API:    http://localhost:54321" -ForegroundColor White
Write-Host "   Edge Functions:  http://localhost:54321/functions/v1" -ForegroundColor White
Write-Host ""
Write-Host "👥 Test Users:" -ForegroundColor Cyan
Write-Host "   📧 student@localhost.dev     (Free tier)" -ForegroundColor White
Write-Host "   📧 researcher@localhost.dev  (Advanced AI)" -ForegroundColor White
Write-Host "   📧 professor@localhost.dev   (Ultra Intelligent)" -ForegroundColor White
Write-Host "   📧 admin@localhost.dev       (PhD Level)" -ForegroundColor White
Write-Host "   🔑 Password: TestPassword123!" -ForegroundColor White
Write-Host ""
Write-Host "💳 Test Stripe Cards:" -ForegroundColor Cyan
Write-Host "   ✅ Success: 4242 4242 4242 4242" -ForegroundColor White
Write-Host "   ❌ Decline: 4000 0000 0000 0002" -ForegroundColor White
Write-Host "   🔐 3D Secure: 4000 0025 0000 3155" -ForegroundColor White
Write-Host ""
Write-Host "🛠️  Development Tools:" -ForegroundColor Cyan
Write-Host "   📊 Mock data enabled for testing" -ForegroundColor White
Write-Host "   🔄 Hot reload active" -ForegroundColor White
Write-Host "   🐛 Debug logs enabled" -ForegroundColor White
Write-Host ""
Write-Host "📋 Quick Commands:" -ForegroundColor Cyan
Write-Host "   Stop all:     Ctrl+C" -ForegroundColor White
Write-Host "   Reset DB:     supabase db reset" -ForegroundColor White
Write-Host "   View logs:    supabase logs" -ForegroundColor White
Write-Host "   Studio:       supabase studio" -ForegroundColor White
Write-Host ""

# Open browser if requested
$openBrowser = Read-Host "🌐 Open browser? (Y/n)"
if ($openBrowser -ne 'n' -and $openBrowser -ne 'N') {
    Start-Process "http://localhost:$Port"
    Start-Process "http://localhost:54323"
}

Write-Host "🚀 Happy coding! Press Ctrl+C to stop all services." -ForegroundColor Green
Write-Host ""

# Keep script running and monitor processes
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if processes are still running
        if ($devProcess -and $devProcess.HasExited) {
            Write-Host "⚠️  Development server stopped unexpectedly" -ForegroundColor Yellow
            break
        }
        
        if ($functionsProcess -and $functionsProcess.HasExited) {
            Write-Host "⚠️  Edge Functions stopped unexpectedly" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
} finally {
    # Cleanup
    if ($devProcess -and -not $devProcess.HasExited) {
        $devProcess.Kill()
    }
    if ($functionsProcess -and -not $functionsProcess.HasExited) {
        $functionsProcess.Kill()
    }
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
