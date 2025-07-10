# Testing PeakeCoin Wallet After GitHub Deployment

## 🚀 Quick Start Testing Guide

### **1. Clone and Setup**

```bash
# Clone your repository
git clone https://github.com/yourusername/peakecoin-real-life-use.git
cd peakecoin-real-life-use/mobile-wallet

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start
```

### **2. Environment Configuration**

Create environment files for testing:

```bash
# Create .env file for development
cp .env.example .env
```

Edit `.env` with your test configuration:
```env
# Hive Network Configuration
HIVE_NODE_URL=https://api.hive.blog
HIVE_ENGINE_API=https://api.hive-engine.com/rpc
PEAK_TOKEN_SYMBOL=PEAK

# Test Account (create a test Hive account)
TEST_ACCOUNT_NAME=your-test-account
TEST_ACTIVE_KEY=your-test-active-key
TEST_MEMO_KEY=your-test-memo-key

# API Keys (for price feeds)
COINGECKO_API_KEY=your-coingecko-key
EXCHANGE_RATE_API_KEY=your-exchange-rate-key

# Development Settings
DEBUG_MODE=true
ENABLE_CONSOLE_LOGS=true
```

### **3. Run on Device/Simulator**

#### **Android Testing:**
```bash
# Start Android emulator or connect device
npx react-native run-android

# For release build testing
npm run build:android
```

#### **iOS Testing:**
```bash
# Start iOS simulator
npx react-native run-ios

# For specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"

# For release build testing
npm run build:ios
```

## 🧪 **Testing Scenarios**

### **A. Wallet Setup Testing**

1. **Fresh Install Test:**
   - Install app on clean device
   - Test first-time setup flow
   - Verify account creation/import

2. **Account Import Test:**
   - Use existing Hive account
   - Import with active key
   - Verify balance display

### **B. Hive Engine Integration Testing**

```javascript
// Test script: test-hive-engine.js
import HiveEngineService from './src/services/HiveEngineService';

async function testHiveEngineConnection() {
  try {
    console.log('Testing Hive Engine connection...');
    
    // Test 1: Get token info
    const tokenInfo = await HiveEngineService.getTokenInfo();
    console.log('✅ Token info:', tokenInfo);
    
    // Test 2: Get balance
    const balance = await HiveEngineService.getPeakCoinBalance('your-test-account');
    console.log('✅ Balance:', balance);
    
    // Test 3: Get price data
    const price = await HiveEngineService.getPeakPrice();
    console.log('✅ Price data:', price);
    
    // Test 4: Get transaction history
    const history = await HiveEngineService.getTransactionHistory('your-test-account');
    console.log('✅ Transaction history:', history.length, 'transactions');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testHiveEngineConnection();
```

### **C. Payment Flow Testing**

Create test QR codes for payment testing:

```javascript
// Generate test QR code
const testPaymentQR = {
  type: 'hive_engine_payment',
  symbol: 'PEAK',
  to: 'test-merchant',
  amount: '5.0000',
  memo: 'Test coffee purchase',
  timestamp: new Date().toISOString()
};

console.log('Test QR Data:', JSON.stringify(testPaymentQR));
```

## 📱 **Device Testing Checklist**

### **Functionality Tests:**

- [ ] **App Launch** - App starts without crashes
- [ ] **Account Setup** - Can import/create Hive account
- [ ] **Balance Display** - Shows correct PEAK balance
- [ ] **QR Scanner** - Camera opens and scans codes
- [ ] **Payment Flow** - Can process test payments
- [ ] **Transaction History** - Shows past transactions
- [ ] **Price Conversion** - USD/PEAK conversion works
- [ ] **Store Locator** - Maps and location services work
- [ ] **Settings** - All configuration options work

### **Performance Tests:**

- [ ] **Cold Start** - App launches quickly from closed state
- [ ] **Memory Usage** - No memory leaks during use
- [ ] **Network Handling** - Graceful offline/online transitions
- [ ] **Background/Foreground** - App resumes properly
- [ ] **Large Transaction Lists** - Smooth scrolling with many transactions

### **Security Tests:**

- [ ] **Key Storage** - Private keys encrypted and secure
- [ ] **Biometric Auth** - Fingerprint/Face ID works
- [ ] **App Lock** - PIN/password protection
- [ ] **Screenshot Protection** - Sensitive screens protected
- [ ] **Deep Link Security** - Malicious QR codes handled safely

## 🌐 **Network Testing**

### **Hive Blockchain Testing:**

```javascript
// Test Hive node connectivity
const testNodes = [
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io'
];

async function testHiveNodes() {
  for (const node of testNodes) {
    try {
      const response = await fetch(`${node}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_dynamic_global_properties',
          id: 1
        })
      });
      
      const data = await response.json();
      console.log(`✅ ${node}: Block ${data.result.head_block_number}`);
    } catch (error) {
      console.error(`❌ ${node}: Failed`);
    }
  }
}
```

### **API Endpoint Testing:**

```bash
# Test Hive Engine API
curl -X POST https://api.hive-engine.com/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "findOne",
    "params": {
      "contract": "tokens",
      "table": "tokens",
      "query": {"symbol": "PEAK"}
    },
    "id": 1
  }'

# Test price API
curl "https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd"
```

## 🔧 **Development Testing Tools**

### **React Native Debugger:**

```bash
# Install React Native Debugger
# Download from: https://github.com/jhen0409/react-native-debugger

# Use with your app
# 1. Start debugger on port 8081
# 2. Enable Debug JS Remotely in app
# 3. Inspect Redux state, network requests, etc.
```

### **Flipper Integration:**

Add Flipper for advanced debugging:

```bash
# Install Flipper
# Download from: https://fbflipper.com/

# Add Flipper to your app (already included in RN 0.72.6)
# Use for network inspection, logs, layout debugging
```

### **Test Data Generation:**

```javascript
// Create test transactions for UI testing
const generateTestTransactions = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `test_tx_${i}`,
    type: i % 2 === 0 ? 'sent' : 'received',
    amount: Math.random() * 100,
    timestamp: new Date(Date.now() - i * 86400000).toISOString(),
    from: i % 2 === 0 ? 'your-account' : 'test-sender',
    to: i % 2 === 0 ? 'test-recipient' : 'your-account',
    memo: `Test transaction ${i + 1}`,
    transactionHash: `abc123${i}`
  }));
};
```

## 🎯 **Real-World Testing Scenarios**

### **Coffee Shop Simulation:**

1. **Setup:** Create merchant test account
2. **Generate QR:** Create payment QR for $5.50
3. **Test Flow:**
   - Customer opens app
   - Scans merchant QR
   - Confirms payment
   - Verify transaction on Hive blockchain

### **Multiple Payment Testing:**

```javascript
// Test rapid payments
const testMultiplePayments = async () => {
  const payments = [
    { amount: 1.50, memo: 'Coffee' },
    { amount: 12.99, memo: 'Lunch' },
    { amount: 0.75, memo: 'Tip' }
  ];
  
  for (const payment of payments) {
    await processTestPayment(payment);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
  }
};
```

## 📊 **Performance Monitoring**

### **Setup Analytics:**

```javascript
// Add performance tracking
import { performance } from 'perf_hooks';

const trackOperation = async (operationName, operation) => {
  const start = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - start;
    console.log(`✅ ${operationName}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ ${operationName}: Failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

// Usage
const balance = await trackOperation('Get Balance', () => 
  HiveEngineService.getPeakCoinBalance('test-account')
);
```

### **Memory Usage Monitoring:**

```javascript
// Monitor memory usage
const logMemoryUsage = () => {
  if (__DEV__) {
    const memInfo = performance.memory;
    console.log('Memory Usage:', {
      used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    });
  }
};

// Call periodically during testing
setInterval(logMemoryUsage, 30000); // Every 30 seconds
```

## 🚦 **Continuous Integration Testing**

### **GitHub Actions Workflow:**

```yaml
# .github/workflows/test.yml
name: Test PeakeCoin Wallet

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd mobile-wallet
        npm install
        
    - name: Run tests
      run: |
        cd mobile-wallet
        npm test
        
    - name: Run linting
      run: |
        cd mobile-wallet
        npm run lint
        
    - name: Test Hive Engine connection
      run: |
        cd mobile-wallet
        node test-scripts/test-hive-engine.js
```

## 📋 **Testing Checklist Summary**

### **Before Release:**
- [ ] All unit tests pass
- [ ] Integration tests with Hive Engine work
- [ ] App runs on both iOS and Android
- [ ] Payment flows tested with real PEAK tokens
- [ ] Security features verified
- [ ] Performance benchmarks met
- [ ] Error handling works properly
- [ ] Offline mode gracefully handled

### **User Acceptance Testing:**
- [ ] Non-technical users can set up wallet
- [ ] QR scanning is intuitive
- [ ] Payment confirmation is clear
- [ ] Transaction history is readable
- [ ] Help/support features are accessible

This comprehensive testing approach ensures your PeakeCoin wallet works reliably in real-world scenarios after deployment!
