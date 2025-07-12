@echo off
echo 🚀 PeakeCoin V4V Wallet - Setup Verification
echo ==========================================

echo.
echo 📦 Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

echo.
echo 📦 Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm not found
    pause
    exit /b 1
)

echo.
echo 📱 Checking React Native CLI...
npx react-native --version
if %errorlevel% neq 0 (
    echo ❌ React Native CLI not available
    echo Installing React Native CLI...
    npm install -g react-native-cli
)

echo.
echo 🤖 Checking Android SDK...
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Android SDK not found in PATH
    echo Please install Android Studio and add SDK to PATH
    echo See: https://developer.android.com/studio
) else (
    echo ✅ Android SDK found
)

echo.
echo 📋 Checking connected devices...
adb devices

echo.
echo 🔍 Checking project dependencies...
if exist package.json (
    echo ✅ package.json found
    
    echo.
    echo 📥 Installing dependencies...
    npm install
    
    if %errorlevel% equ 0 (
        echo ✅ Dependencies installed successfully
    ) else (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ❌ package.json not found. Are you in the right directory?
    pause
    exit /b 1
)

echo.
echo 🎯 Testing project structure...
if exist src\services\V4VService.js (
    echo ✅ V4VService found
) else (
    echo ❌ V4VService missing
)

if exist src\screens\CreatorDashboardScreen.tsx (
    echo ✅ Creator Dashboard found
) else (
    echo ❌ Creator Dashboard missing
)

if exist src\screens\ContentDiscoveryScreen.tsx (
    echo ✅ Content Discovery found
) else (
    echo ❌ Content Discovery missing
)

if exist src\screens\StoreLocatorScreen.tsx (
    echo ✅ Store Locator found
) else (
    echo ❌ Store Locator missing
)

echo.
echo 🚀 Ready to test! Choose an option:
echo.
echo 1. Start Metro bundler only (for debugging)
echo 2. Run on Android emulator (recommended)
echo 3. Run on connected Android device
echo 4. Build release APK
echo 5. Run tests
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo Starting Metro bundler...
    npx react-native start
) else if "%choice%"=="2" (
    echo Starting Android emulator build...
    npx react-native run-android
) else if "%choice%"=="3" (
    echo Checking for connected devices...
    adb devices
    echo Running on connected device...
    npx react-native run-android
) else if "%choice%"=="4" (
    echo Building release APK...
    cd android
    call gradlew assembleRelease
    echo.
    echo APK built at: android\app\build\outputs\apk\release\app-release.apk
    cd ..
) else if "%choice%"=="5" (
    echo Running tests...
    npm test
) else if "%choice%"=="6" (
    echo Goodbye! 👋
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
)

pause
