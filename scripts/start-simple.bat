@echo off
echo ========================================
echo Scholar AI Simple Localhost Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    pause
    exit /b 1
)

echo [1/4] Node.js: OK
echo.

REM Create simple local environment file
if not exist ".env.local" (
    echo [2/4] Creating local environment file...
    (
        echo # Scholar AI Local Development Environment
        echo NODE_ENV=development
        echo VITE_APP_ENV=development
        echo VITE_DEV_MODE=true
        echo.
        echo # Mock Mode - No external services needed
        echo VITE_MOCK_PAYMENTS=true
        echo VITE_MOCK_AI_RESPONSES=true
        echo VITE_ENABLE_DEBUG_LOGS=true
        echo VITE_SHOW_DEV_TOOLS=true
        echo.
        echo # Placeholder URLs for development
        echo VITE_SUPABASE_URL=http://localhost:54321
        echo VITE_SUPABASE_ANON_KEY=mock-key-for-development
        echo VITE_STRIPE_PUBLISHABLE_KEY=pk_test_mock
        echo.
        echo # App URL
        echo VITE_APP_URL=http://localhost:5173
    ) > .env.local
    echo Local environment created
) else (
    echo [2/4] Local environment: OK
)
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo [3/4] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [3/4] Dependencies: OK
)
echo.

echo [4/4] Starting development server...
echo.
echo ========================================
echo Scholar AI Localhost Ready!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo.
echo NOTE: Running in MOCK MODE
echo - All payments are simulated
echo - All AI responses are mocked
echo - No external services required
echo.
echo This is perfect for:
echo - UI/UX testing
echo - Frontend development
echo - Feature testing
echo - Design tweaking
echo.
echo Press Ctrl+C to stop
echo.

REM Start the development server
npm run dev
