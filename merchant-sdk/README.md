# PeakeCoin Merchant Integration SDK

Simple JavaScript SDK for integrating PeakeCoin payments into existing point-of-sale systems.

## Installation

```bash
npm install peakecoin-merchant-sdk
```

## Quick Start

```javascript
const PeakeCoin = require('peakecoin-merchant-sdk');

// Initialize with your merchant credentials
const payments = new PeakeCoin.Payments({
  merchantId: 'your-merchant-id',
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Create a payment request
const payment = await payments.create({
  amount: 25.99,
  currency: 'USD',
  description: 'Coffee and pastry'
});

console.log('Show this QR code to customer:');
console.log(payment.qrCode);
console.log('Payment ID:', payment.id);

// Check payment status
const status = await payments.getStatus(payment.id);
console.log('Payment status:', status);
```

## API Reference

### Payments.create(options)

Creates a new payment request.

**Parameters:**
- `amount` (number) - Payment amount in specified currency
- `currency` (string) - Currency code (USD, EUR, etc.)
- `description` (string) - Payment description
- `callbackUrl` (string, optional) - Webhook URL for payment notifications

**Returns:**
- `id` (string) - Unique payment identifier
- `qrCode` (string) - Base64 encoded QR code image
- `amount` (number) - PeakeCoin amount required
- `address` (string) - Payment wallet address
- `expiresAt` (Date) - Payment expiration time

### Payments.getStatus(paymentId)

Retrieves the current status of a payment.

**Parameters:**
- `paymentId` (string) - Payment identifier

**Returns:**
- `status` (string) - 'pending', 'confirmed', 'expired', or 'failed'
- `transactionHash` (string) - Blockchain transaction hash (if confirmed)
- `confirmedAt` (Date) - Confirmation timestamp (if confirmed)

### Payments.onStatusChange(callback)

Sets up real-time payment status notifications.

**Parameters:**
- `callback` (function) - Function called when payment status changes

**Example:**
```javascript
payments.onStatusChange((payment) => {
  console.log(`Payment ${payment.id} status: ${payment.status}`);
  
  if (payment.status === 'confirmed') {
    console.log('Payment successful! Transaction:', payment.transactionHash);
    // Update your POS system, print receipt, etc.
  }
});
```

## POS System Integration Examples

### Square Integration

```javascript
const square = require('squareconnect');
const PeakeCoin = require('peakecoin-merchant-sdk');

// Initialize both SDKs
const squareClient = new square.ApiClient();
const peakeCoin = new PeakeCoin.Payments({ /* config */ });

async function processPayment(orderTotal) {
  // Create PeakeCoin payment
  const payment = await peakeCoin.create({
    amount: orderTotal,
    currency: 'USD',
    description: 'Square POS Sale'
  });
  
  // Display QR code on Square terminal
  await displayQRCode(payment.qrCode);
  
  // Wait for payment confirmation
  return new Promise((resolve, reject) => {
    peakeCoin.onStatusChange((payment) => {
      if (payment.status === 'confirmed') {
        resolve(payment);
      } else if (payment.status === 'failed') {
        reject(new Error('Payment failed'));
      }
    });
  });
}
```

### Shopify POS Integration

```javascript
const PeakeCoin = require('peakecoin-merchant-sdk');

// Shopify POS App Extension
const peakCoin = new PeakeCoin.Payments({
  merchantId: process.env.PEAKECOIN_MERCHANT_ID,
  apiKey: process.env.PEAKECOIN_API_KEY
});

// Handle payment method selection
async function handlePeakeCoinPayment(order) {
  try {
    const payment = await peakCoin.create({
      amount: order.total,
      currency: order.currency,
      description: `Shopify Order #${order.id}`
    });
    
    // Show payment interface in Shopify POS
    await showPaymentModal({
      qrCode: payment.qrCode,
      amount: payment.amount,
      currency: 'PEAK'
    });
    
    // Process the payment
    const result = await waitForPayment(payment.id);
    
    if (result.status === 'confirmed') {
      // Mark order as paid in Shopify
      await markOrderPaid(order.id, result.transactionHash);
      return { success: true, transaction: result.transactionHash };
    }
    
  } catch (error) {
    console.error('PeakeCoin payment failed:', error);
    return { success: false, error: error.message };
  }
}
```

### Custom POS Integration

```javascript
const PeakeCoin = require('peakecoin-merchant-sdk');
const QRCode = require('qrcode');

class CustomPOS {
  constructor() {
    this.peakCoin = new PeakeCoin.Payments({
      merchantId: 'your-merchant-id',
      apiKey: 'your-api-key'
    });
  }
  
  async processPayment(items, total) {
    // Calculate total and create payment
    const payment = await this.peakCoin.create({
      amount: total,
      currency: 'USD',
      description: `Sale: ${items.length} items`
    });
    
    // Display payment info on your POS screen
    console.log('═══════════════════════════════');
    console.log('   PEAKECOIN PAYMENT REQUEST   ');
    console.log('═══════════════════════════════');
    console.log(`Amount: $${total}`);
    console.log(`PeakeCoin: ${payment.amount} PEAK`);
    console.log('');
    console.log('Customer: Scan QR code with PeakeCoin wallet');
    
    // Show QR code (in real POS, display on screen)
    await QRCode.toString(payment.qrCode, { type: 'terminal' });
    
    // Monitor payment status
    return this.waitForConfirmation(payment.id);
  }
  
  async waitForConfirmation(paymentId) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Payment timeout'));
      }, 300000); // 5 minute timeout
      
      this.peakCoin.onStatusChange((payment) => {
        if (payment.id === paymentId) {
          clearTimeout(timeout);
          
          if (payment.status === 'confirmed') {
            console.log('✅ Payment confirmed!');
            console.log(`Transaction: ${payment.transactionHash}`);
            resolve(payment);
          } else if (payment.status === 'failed') {
            console.log('❌ Payment failed');
            reject(new Error('Payment failed'));
          }
        }
      });
    });
  }
}

// Usage example
const pos = new CustomPOS();

async function checkout() {
  const items = [
    { name: 'Coffee', price: 4.50 },
    { name: 'Sandwich', price: 8.99 }
  ];
  
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  try {
    const payment = await pos.processPayment(items, total);
    console.log('Payment successful! Printing receipt...');
    printReceipt(items, total, payment);
  } catch (error) {
    console.log('Payment failed:', error.message);
  }
}
```

## Configuration

### Environment Variables

```bash
# Required
PEAKECOIN_MERCHANT_ID=your-merchant-id
PEAKECOIN_API_KEY=your-api-key

# Optional
PEAKECOIN_ENVIRONMENT=production  # or 'sandbox'
PEAKECOIN_WEBHOOK_URL=https://yourstore.com/webhook
PEAKECOIN_SETTLEMENT_CURRENCY=USD  # or 'PEAK'
```

### Advanced Configuration

```javascript
const payments = new PeakeCoin.Payments({
  merchantId: 'your-merchant-id',
  apiKey: 'your-api-key',
  environment: 'production',
  
  // Webhook configuration
  webhook: {
    url: 'https://yourstore.com/peakecoin-webhook',
    secret: 'webhook-secret-key'
  },
  
  // Settlement preferences
  settlement: {
    currency: 'USD',        // Receive USD instead of PeakeCoin
    schedule: 'daily',      // daily, weekly, or manual
    minimumAmount: 100      // Minimum amount before settlement
  },
  
  // Payment defaults
  defaults: {
    expirationMinutes: 15,  // Payment expiration time
    confirmations: 3        // Required blockchain confirmations
  },
  
  // Network configuration
  network: {
    timeout: 30000,         // API timeout in milliseconds
    retries: 3              // Number of retry attempts
  }
});
```

## Error Handling

```javascript
try {
  const payment = await payments.create({
    amount: 25.99,
    currency: 'USD'
  });
} catch (error) {
  switch (error.code) {
    case 'INVALID_AMOUNT':
      console.log('Invalid payment amount');
      break;
    case 'MERCHANT_NOT_FOUND':
      console.log('Invalid merchant credentials');
      break;
    case 'NETWORK_ERROR':
      console.log('Network connection issue');
      break;
    case 'RATE_LIMITED':
      console.log('Too many requests, please wait');
      break;
    default:
      console.log('Unknown error:', error.message);
  }
}
```

## Testing

```javascript
// Use sandbox environment for testing
const testPayments = new PeakeCoin.Payments({
  merchantId: 'test-merchant',
  apiKey: 'test-api-key',
  environment: 'sandbox'
});

// Test payment creation
const testPayment = await testPayments.create({
  amount: 1.00,
  currency: 'USD',
  description: 'Test payment'
});

console.log('Test payment created:', testPayment.id);

// Simulate payment confirmation (sandbox only)
await testPayments.simulateConfirmation(testPayment.id);
```

## Support

- **Documentation**: https://docs.peakecoin.com/merchants
- **API Reference**: https://api.peakecoin.com/docs
- **Support Email**: merchants@peakecoin.com
- **Community**: https://community.peakecoin.com

## License

MIT License - see LICENSE file for details.
