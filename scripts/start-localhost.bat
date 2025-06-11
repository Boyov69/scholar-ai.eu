@echo off
echo ========================================
echo Scholar AI Localhost Development Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/6] Checking prerequisites...
echo Node.js: OK
echo npm: OK
echo.

REM Install Supabase CLI if not present
supabase --version >nul 2>&1
if errorlevel 1 (
    echo [2/6] Installing Supabase CLI...
    npm install -g supabase
    if errorlevel 1 (
        echo ERROR: Failed to install Supabase CLI
        pause
        exit /b 1
    )
) else (
    echo [2/6] Supabase CLI: OK
)
echo.

REM Create local environment file if it doesn't exist
if not exist ".env.local" (
    echo [3/6] Creating local environment file...
    (
        echo # Scholar AI Local Development Environment
        echo NODE_ENV=development
        echo VITE_APP_ENV=development
        echo VITE_DEV_MODE=true
        echo.
        echo # Local Supabase
        echo VITE_SUPABASE_URL=http://localhost:54321
        echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
        echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
        echo.
        echo # Test Stripe Keys
        echo VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
        echo STRIPE_SECRET_KEY=sk_test_51234567890abcdef
        echo.
        echo # Development Flags
        echo VITE_MOCK_PAYMENTS=true
        echo VITE_MOCK_AI_RESPONSES=true
        echo VITE_ENABLE_DEBUG_LOGS=true
    ) > .env.local
    echo Local environment file created
) else (
    echo [3/6] Local environment: OK
)
echo.

REM Install dependencies
if not exist "node_modules" (
    echo [4/6] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [4/6] Dependencies: OK
)
echo.

REM Initialize and start Supabase
echo [5/6] Starting Supabase services...
if not exist "supabase\config.toml" (
    echo Initializing Supabase...
    supabase init
)

echo Starting Supabase local services...
supabase start
if errorlevel 1 (
    echo ERROR: Failed to start Supabase services
    echo Try running: supabase stop
    echo Then run this script again
    pause
    exit /b 1
)
echo.

REM Create test data
echo [6/6] Creating test data...
node scripts/create-test-data.js
echo.

echo ========================================
echo SUCCESS! Scholar AI Localhost is ready!
echo ========================================
echo.
echo URLs:
echo   Frontend:        http://localhost:5173
echo   Supabase Studio: http://localhost:54323
echo   Supabase API:    http://localhost:54321
echo.
echo Test Users:
echo   student@localhost.dev     (Free tier)
echo   researcher@localhost.dev  (Advanced AI)
echo   professor@localhost.dev   (Ultra Intelligent)
echo   admin@localhost.dev       (PhD Level)
echo   Password: TestPassword123!
echo.
echo Test Stripe Cards:
echo   Success: 4242 4242 4242 4242
echo   Decline: 4000 0000 0000 0002
echo.
echo Starting development server...
echo Press Ctrl+C to stop all services
echo.

REM Start the development server
npm run dev
