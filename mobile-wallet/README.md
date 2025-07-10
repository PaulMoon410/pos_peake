# PeakeCoin Mobile Wallet

A React Native mobile application for spending PeakeCoin in real-world stores.

## Features

- **QR Code Scanner**: Scan merchant QR codes for instant payments
- **Wallet Management**: View balance, transaction history, and manage multiple wallets
- **Store Locator**: Find nearby stores accepting PeakeCoin
- **Contactless Payments**: NFC support for tap-to-pay functionality
- **Price Conversion**: Real-time fiat currency conversion
- **Security**: Biometric authentication and secure key storage

## Screenshots

[Add screenshots here]

## Installation

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Setup
```bash
npm install
npx react-native start
npx react-native run-android  # For Android
npx react-native run-ios      # For iOS
```

## Features Implementation

### QR Code Payments
The app uses the device camera to scan QR codes containing payment information and processes transactions through the PeakeCoin network.

### Store Integration
Merchants can integrate with our payment gateway to accept PeakeCoin payments with real-time conversion rates.

### Security
- Encrypted local storage
- Biometric authentication
- Secure transaction signing
- PIN/password protection

## API Integration

The app integrates with:
- PeakeCoin blockchain network
- Payment gateway API
- Price conversion services
- Merchant directory
