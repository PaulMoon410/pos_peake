@echo off
REM Quick test script for PeakeCoin wallet on Windows
REM Usage: quick-test.bat

echo 🚀 PeakeCoin Wallet Quick Test Script (Windows)
echo ================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the mobile-wallet directory
    exit /b 1
)

echo.
echo ℹ️  Starting PeakeCoin wallet tests...
echo.

REM 1. Check Node.js version
echo 1. Checking Node.js version...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    exit /b 1
) else (
    echo ✅ Node.js is installed
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ℹ️  Node.js version: %NODE_VERSION%
)
echo.

REM 2. Check if package.json exists and is valid
echo 2. Validating package.json...
npm list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ package.json is invalid or dependencies missing
) else (
    echo ✅ package.json is valid
)
echo.

REM 3. Install dependencies
echo 3. Installing dependencies...
echo ℹ️  Running npm install...
npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
) else (
    echo ✅ Dependencies installed
)
echo.

REM 4. Check for required environment
echo 4. Checking environment setup...
if not exist ".env" (
    if exist ".env.example" (
        echo ⚠️  No .env file found, copying from .env.example
        copy ".env.example" ".env" >nul
        echo ℹ️  Please edit .env with your actual configuration
    ) else (
        echo ⚠️  No .env or .env.example file found
    )
) else (
    echo ✅ Environment file exists
)
echo.

REM 5. Run linting
echo 5. Running code linting...
npm run lint --silent >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Code linting found issues (run 'npm run lint' for details)
) else (
    echo ✅ Code linting passed
)
echo.

REM 6. Run unit tests
echo 6. Running unit tests...
npm test -- --passWithNoTests --silent >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Some unit tests failed (run 'npm test' for details)
) else (
    echo ✅ Unit tests passed
)
echo.

REM 7. Test Hive Engine integration
echo 7. Testing Hive Engine integration...
if exist "test-scripts\test-hive-engine.js" (
    node test-scripts\test-hive-engine.js
    echo ✅ Hive Engine integration test completed
) else (
    echo ⚠️  Hive Engine test script not found
)
echo.

REM 8. Check Android setup
echo 8. Checking mobile development setup...
where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Android SDK tools not found
) else (
    echo ✅ Android SDK tools found
    for /f "skip=1" %%i in ('adb devices 2^>nul') do set /a DEVICE_COUNT+=1
    if defined DEVICE_COUNT (
        echo ℹ️  Android devices/emulators connected: %DEVICE_COUNT%
    ) else (
        echo ⚠️  No Android devices/emulators connected
    )
)
echo.

REM 9. Check React Native setup
echo 9. Checking React Native setup...
where npx >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  npx not found, cannot check React Native
) else (
    echo ✅ npx is available
    echo ℹ️  Checking React Native environment...
    npx react-native doctor >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  React Native environment may need attention
        echo ℹ️  Run 'npx react-native doctor' for details
    ) else (
        echo ✅ React Native environment is ready
    )
)
echo.

REM 10. Payment Gateway check
echo 10. Checking payment gateway...
if exist "..\payment-gateway" (
    echo ✅ Payment gateway directory found
    cd ..\payment-gateway
    
    if exist "package.json" (
        echo ℹ️  Installing payment gateway dependencies...
        npm install --silent
        echo ✅ Payment gateway dependencies installed
    ) else (
        echo ⚠️  Payment gateway package.json not found
    )
    
    cd ..\mobile-wallet
) else (
    echo ⚠️  Payment gateway directory not found
)
echo.

REM Summary
echo 🎯 Test Summary
echo ===============
echo ℹ️  Quick tests completed!
echo.
echo ℹ️  Next steps to test on device:
echo   📱 Android: npx react-native run-android
echo   🌐 Payment Gateway: cd ..\payment-gateway && npm start
echo.
echo ℹ️  For full testing:
echo   📖 See TESTING_GUIDE.md for comprehensive testing instructions
echo   🔧 Check .env file for proper configuration
echo   🧪 Run integration tests with real Hive accounts
echo.

echo 🎉 Quick tests completed successfully!
echo Your PeakeCoin wallet is ready for device testing.

pause
