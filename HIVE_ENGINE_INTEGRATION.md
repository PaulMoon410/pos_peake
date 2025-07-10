# PeakeCoin + Hive Engine Integration Guide

## Overview

This guide explains how PeakeCoin integrates with Hive Engine to enable real-world spending capabilities. If PeakeCoin is a Hive Engine token, this integration is essential for creating a functional payment system.

## 🔗 **How PeakeCoin Interacts with Hive Engine**

### **1. Token Foundation**
- **PeakeCoin (PEAK)** exists as a token on Hive Engine
- **Hive Engine** is a smart contract platform built on the Hive blockchain
- **Transactions** are recorded on the Hive blockchain using custom_json operations
- **Smart contracts** handle token transfers, balances, and market operations

### **2. Technical Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Wallet │    │  Hive Engine    │    │ Hive Blockchain │
│    (React       │────│   Smart         │────│    (Custom      │
│     Native)     │    │  Contracts      │    │     JSON)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   QR Payments   │    │ Token Balances  │    │ Transaction     │
│   Store Locator │    │ Market Data     │    │ History         │
│   Price Feeds   │    │ Transfer Logic  │    │ Immutable Log   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **3. Key Integration Components**

#### **A. HiveEngineService.js**
```javascript
// Core service for Hive Engine interactions
class HiveEngineService {
  // Get PeakeCoin balance from Hive Engine
  async getPeakCoinBalance(account) {
    // Queries tokens contract for balance
  }
  
  // Transfer PeakeCoin between accounts
  async transferPeakCoin(from, to, amount, memo, activeKey) {
    // Creates custom_json transaction on Hive blockchain
  }
  
  // Get transaction history
  async getTransactionHistory(account) {
    // Fetches custom_json operations from Hive
  }
}
```

#### **B. Real-World Payment Flow**
1. **Customer** scans merchant QR code
2. **Mobile app** parses payment details
3. **HiveEngineService** creates transfer transaction
4. **Hive blockchain** records the transaction
5. **Merchant** receives confirmation via webhook
6. **Payment gateway** updates status

## 🏪 **Merchant Integration with Hive Engine**

### **Payment Gateway Setup**
```javascript
// Payment gateway processes Hive Engine transactions
const payment = await payments.create({
  amount: 25.99,        // USD amount
  currency: 'USD',
  merchantAccount: 'merchant123',  // Hive account
  description: 'Coffee purchase'
});

// Generates QR code with Hive Engine payment data
const qrData = {
  type: 'hive_engine_payment',
  symbol: 'PEAK',
  to: 'merchant123',
  amount: peakCoinAmount,
  memo: paymentMemo
};
```

### **Transaction Verification**
```javascript
// Verify payment on Hive blockchain
async function verifyPayment(transactionId) {
  const transaction = await hiveClient.database.getTransaction(transactionId);
  
  // Check if it's a valid PEAK transfer
  const isValidPeakTransfer = transaction.operations.some(op => {
    if (op[0] === 'custom_json' && op[1].id === 'ssc-mainnet-hive') {
      const json = JSON.parse(op[1].json);
      return json.contractName === 'tokens' && 
             json.contractAction === 'transfer' &&
             json.contractPayload.symbol === 'PEAK';
    }
    return false;
  });
  
  return isValidPeakTransfer;
}
```

## 💰 **Price and Market Data Integration**

### **Real-Time Price Feeds**
```javascript
// Get PEAK price from Hive Engine market
async function getPeakPrice() {
  const marketData = await hiveEngine.getMarketMetrics('PEAK');
  const hivePrice = await getHivePrice(); // From external API
  
  return {
    peakPriceHive: marketData.lastPrice,
    peakPriceUSD: marketData.lastPrice * hivePrice,
    volume24h: marketData.volume
  };
}
```

### **Currency Conversion**
```javascript
// Convert between PEAK and fiat currencies
async function convertForPayment(amount, fromCurrency, toCurrency) {
  if (fromCurrency === 'USD' && toCurrency === 'PEAK') {
    const peakPrice = await getPeakPrice();
    return amount / peakPrice.peakPriceUSD;
  }
  // Handle other conversions...
}
```

## 🔐 **Security Considerations**

### **Private Key Management**
```javascript
// Secure storage of Hive account keys
import EncryptedStorage from 'react-native-encrypted-storage';

// Store encrypted active key for transactions
await EncryptedStorage.setItem('hive_active_key', encryptedActiveKey);

// Use for signing transactions
const activeKey = await EncryptedStorage.getItem('hive_active_key');
```

### **Transaction Security**
- **Active key** required for token transfers
- **Posting key** for some operations (not transfers)
- **Memo encryption** for private transaction notes
- **Transaction validation** on Hive blockchain

## 📱 **Mobile App Features**

### **Core Wallet Functions**
```javascript
// Check PEAK balance
const balance = await WalletService.getBalance();

// Send PEAK payment
const result = await WalletService.sendPayment(
  'recipient123',    // Hive account
  10.5,             // PEAK amount
  'Coffee payment'   // Memo
);

// Process QR code payment
const payment = await WalletService.processQRPayment(qrData);
```

### **Real-World Spending Features**
- **QR code scanner** for merchant payments
- **Store locator** finding PEAK-accepting businesses
- **Transaction history** from Hive blockchain
- **Price conversion** USD ↔ PEAK
- **Balance management** with real-time updates

## 🌐 **Network Configuration**

### **Hive Blockchain Nodes**
```javascript
const hiveNodes = [
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io'
];
```

### **Hive Engine APIs**
```javascript
const hiveEngineAPIs = {
  rpc: 'https://api.hive-engine.com/rpc',
  accounts: 'https://engine.rishipanthee.com'
};
```

## 🚀 **Deployment Steps**

### **1. Set Up Dependencies**
```bash
npm install @hiveio/hive-js hive-engine @splinterlands/hive-interface
```

### **2. Configure Environment**
```env
HIVE_NODE_URL=https://api.hive.blog
HIVE_ENGINE_API=https://api.hive-engine.com/rpc
PEAK_TOKEN_SYMBOL=PEAK
```

### **3. Initialize Services**
```javascript
import HiveEngineService from './services/HiveEngineService';
import WalletService from './services/WalletService';

// Initialize wallet with Hive account
await WalletService.setupAccount('username', 'activeKey', 'memoKey');

// Start using PEAK for payments
const balance = await WalletService.getBalance();
```

## 📊 **Real-World Use Cases**

### **Coffee Shop Payment**
1. Customer orders coffee ($5.50)
2. Merchant generates QR code
3. Customer scans with PEAK wallet
4. App converts $5.50 to PEAK amount
5. Customer confirms payment
6. PEAK transfers on Hive Engine
7. Merchant receives confirmation
8. Coffee is served!

### **Online Store Integration**
```javascript
// E-commerce checkout with PEAK
const checkout = {
  items: [...],
  total: 45.99,
  currency: 'USD',
  paymentMethod: 'PEAK'
};

// Convert to PEAK amount
const peakAmount = await convertUSDToPeak(checkout.total);

// Generate payment request
const payment = await createHiveEnginePayment({
  amount: peakAmount,
  merchant: 'onlinestore123',
  orderId: 'ORDER_12345'
});
```

## 🔧 **Development Tools**

### **Testing on Hive Testnet**
```javascript
// Use Hive testnet for development
const testnetConfig = {
  nodes: ['https://testnet.openhive.network'],
  chainId: '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e'
};
```

### **Debugging Transactions**
```javascript
// Check transaction on Hive Explorer
const explorerUrl = `https://hiveblocks.com/tx/${transactionId}`;

// Verify Hive Engine operation
const engineUrl = `https://hive-engine.rocks/transactions/${transactionId}`;
```

## 📈 **Benefits of Hive Engine Integration**

### **For Users:**
- **Fast transactions** (3-second block times)
- **Low fees** (resource credits, not direct fees)
- **Familiar interface** (Hive ecosystem)
- **Proven technology** (established since 2020)

### **For Merchants:**
- **Instant settlements** (no waiting periods)
- **Global accessibility** (no geographic restrictions)
- **Low processing costs** (minimal network fees)
- **Transparent operations** (blockchain verification)

### **For Developers:**
- **Rich APIs** for token operations
- **Smart contract** functionality
- **Active community** and documentation
- **Cross-platform** compatibility

## 🎯 **Next Steps**

1. **Complete mobile app** development with Hive Engine integration
2. **Deploy payment gateway** with PEAK support
3. **Onboard merchants** to accept PEAK payments
4. **Launch pilot program** in crypto-friendly locations
5. **Scale to multiple cities** based on adoption

The integration with Hive Engine provides PeakeCoin with a robust, proven infrastructure for real-world payments while maintaining the security and decentralization benefits of blockchain technology.
