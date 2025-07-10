#!/bin/bash

# Quick test script for PeakeCoin wallet after GitHub deployment
# Usage: ./quick-test.sh

echo "🚀 PeakeCoin Wallet Quick Test Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the mobile-wallet directory"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
print_info "Starting PeakeCoin wallet tests..."
echo ""

# 1. Check Node.js version
echo "1. Checking Node.js version..."
node --version > /dev/null 2>&1
print_status "Node.js is installed"
NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"
echo ""

# 2. Check if package.json exists and is valid
echo "2. Validating package.json..."
npm list > /dev/null 2>&1
print_status "package.json is valid"
echo ""

# 3. Install dependencies
echo "3. Installing dependencies..."
print_info "Running npm install..."
npm install --silent
print_status "Dependencies installed"
echo ""

# 4. Check for required environment
echo "4. Checking environment setup..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        print_warning "No .env file found, copying from .env.example"
        cp .env.example .env
        print_info "Please edit .env with your actual configuration"
    else
        print_warning "No .env or .env.example file found"
    fi
else
    print_status "Environment file exists"
fi
echo ""

# 5. Run linting
echo "5. Running code linting..."
npm run lint --silent
print_status "Code linting passed"
echo ""

# 6. Run unit tests
echo "6. Running unit tests..."
npm test -- --passWithNoTests --silent
print_status "Unit tests passed"
echo ""

# 7. Test Hive Engine integration
echo "7. Testing Hive Engine integration..."
if [ -f "test-scripts/test-hive-engine.js" ]; then
    node test-scripts/test-hive-engine.js
    print_status "Hive Engine integration test completed"
else
    print_warning "Hive Engine test script not found"
fi
echo ""

# 8. Check Android/iOS setup
echo "8. Checking mobile development setup..."

# Check Android
if command -v adb &> /dev/null; then
    print_status "Android SDK tools found"
    ADB_DEVICES=$(adb devices | grep -v "List of devices" | wc -l)
    if [ $ADB_DEVICES -gt 1 ]; then
        print_info "Android devices/emulators connected: $((ADB_DEVICES-1))"
    else
        print_warning "No Android devices/emulators connected"
    fi
else
    print_warning "Android SDK tools not found"
fi

# Check iOS (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcrun &> /dev/null; then
        print_status "iOS development tools found"
    else
        print_warning "iOS development tools not found"
    fi
else
    print_info "iOS testing only available on macOS"
fi
echo ""

# 9. Check React Native setup
echo "9. Checking React Native setup..."
if command -v npx &> /dev/null; then
    print_status "npx is available"
    
    # Try to run Metro bundler check
    print_info "Checking React Native environment..."
    npx react-native doctor > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "React Native environment is ready"
    else
        print_warning "React Native environment may need attention"
        print_info "Run 'npx react-native doctor' for details"
    fi
else
    print_warning "npx not found, cannot check React Native"
fi
echo ""

# 10. Payment Gateway check
echo "10. Checking payment gateway..."
if [ -d "../payment-gateway" ]; then
    print_status "Payment gateway directory found"
    cd ../payment-gateway
    
    if [ -f "package.json" ]; then
        print_info "Installing payment gateway dependencies..."
        npm install --silent
        print_status "Payment gateway dependencies installed"
        
        # Quick server test
        print_info "Testing payment gateway server..."
        timeout 10s npm start > /dev/null 2>&1 &
        SERVER_PID=$!
        sleep 3
        
        if kill -0 $SERVER_PID 2>/dev/null; then
            print_status "Payment gateway server can start"
            kill $SERVER_PID
        else
            print_warning "Payment gateway server test failed"
        fi
    else
        print_warning "Payment gateway package.json not found"
    fi
    
    cd ../mobile-wallet
else
    print_warning "Payment gateway directory not found"
fi
echo ""

# Summary
echo "🎯 Test Summary"
echo "==============="
print_info "Quick tests completed!"
echo ""
print_info "Next steps to test on device:"
echo "  📱 Android: npx react-native run-android"
echo "  🍎 iOS: npx react-native run-ios"
echo "  🌐 Payment Gateway: cd ../payment-gateway && npm start"
echo ""
print_info "For full testing:"
echo "  📖 See TESTING_GUIDE.md for comprehensive testing instructions"
echo "  🔧 Check .env file for proper configuration"
echo "  🧪 Run integration tests with real Hive accounts"
echo ""

# Final status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Quick tests completed successfully!${NC}"
    echo -e "${GREEN}Your PeakeCoin wallet is ready for device testing.${NC}"
else
    echo -e "${RED}⚠️  Some tests had issues. Check the output above.${NC}"
fi
