# PeakeCoin Payment Gateway

A comprehensive payment gateway solution for accepting PeakeCoin in retail environments.

## Features

- Real-time PeakeCoin to USD/EUR conversion
- QR code generation for payments
- Merchant dashboard
- Transaction history and reporting
- Webhook notifications
- Multi-currency support

## Architecture

```
Customer App/Wallet → QR Code → Merchant POS → Payment Gateway → PeakeCoin Blockchain
                                      ↓
                               Merchant Dashboard
```

## Quick Start

1. Install dependencies: `npm install`
2. Configure environment variables
3. Run the gateway: `npm start`
4. Access merchant dashboard: `http://localhost:3000`

## API Endpoints

- `POST /api/payment/create` - Create new payment request
- `GET /api/payment/status/:id` - Check payment status
- `POST /api/payment/webhook` - Receive payment confirmations
- `GET /api/merchant/dashboard` - Merchant analytics

## Integration Examples

See the `/examples` directory for integration with popular POS systems:
- Square
- Stripe Terminal
- Shopify POS
- Custom solutions
