# PeakeCoin V4V Wallet - Testing Setup Guide

## 🚀 Quick Start Testing (Single Computer)

### Option 1: Android Emulator (Recommended)

1. **Install Android Studio**
   ```bash
   # Download from: https://developer.android.com/studio
   ```

2. **Set up Android SDK**
   ```bash
   # Add to your PATH:
   # C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools
   # C:\Users\%USERNAME%\AppData\Local\Android\Sdk\tools
   ```

3. **Create Virtual Device**
   - Open Android Studio → AVD Manager
   - Create new virtual device (Pixel 4, API 30+)
   - Start emulator

4. **Run Your App**
   ```bash
   cd "c:\Users\Moon\Desktop\PeakeCoin\Real Life Use\mobile-wallet"
   npm install
   npx react-native run-android
   ```

### Option 2: Physical Android Device

1. **Enable Developer Options**
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable USB Debugging

2. **Connect via USB**
   ```bash
   adb devices  # Should show your device
   npx react-native run-android
   ```

### Option 3: iOS (Mac Required)

```bash
npx react-native run-ios
# Or open ios/PeakeCoinWallet.xcworkspace in Xcode
```

## 📱 Testing Scenarios

### V4V Features to Test:
- [ ] Content discovery and browsing
- [ ] Streaming payment start/stop
- [ ] Boost message sending
- [ ] Creator dashboard analytics
- [ ] Rate adjustments during streaming

### Merchant Features to Test:
- [ ] Store locator and filtering
- [ ] QR code payment generation
- [ ] Payment processing
- [ ] Discount calculations

### Wallet Features to Test:
- [ ] Balance checking
- [ ] Transaction history
- [ ] Send/receive PEAK tokens
- [ ] Security features

## 🔧 Development Tools

### Chrome DevTools for React Native
```bash
npx react-native start
# Then open Chrome → chrome://inspect
```

### Flipper Debugging
```bash
# Install Flipper desktop app
# Automatically detects React Native apps
```

### VS Code Extensions
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Bracket Pair Colorizer

## 🧪 Testing Without Second Computer

### Mock Two-Device Scenarios:

1. **Merchant Testing**
   ```javascript
   // Use mock merchant data in StoreLocatorScreen
   // Test QR generation without actual scanning
   ```

2. **P2P Testing**
   ```javascript
   // Create mock wallet addresses
   // Simulate transaction responses
   ```

3. **Network Testing**
   ```bash
   # Use ngrok to expose local backend
   ngrok http 3000
   ```

## 📊 Performance Testing

### Memory Usage
```bash
# Android
adb shell dumpsys meminfo com.peakecoinkwallet

# Monitor in Android Studio
```

### Network Monitoring
```bash
# Use network tab in Chrome DevTools
# Monitor Hive Engine API calls
```

## 🚀 Advanced Testing (Future)

### When to Consider Second Device:
- Real merchant pilot programs
- User acceptance testing
- Load testing with multiple wallets
- Cross-platform compatibility

### Cloud Testing Alternatives:
- Firebase Test Lab
- BrowserStack App Live
- AWS Device Farm
- TestComplete Mobile

## 🎯 Testing Priorities

### Phase 1 (Current Computer):
1. V4V streaming functionality
2. UI/UX flow testing
3. Hive Engine integration
4. Basic wallet operations

### Phase 2 (Real Device):
1. Camera QR scanning
2. GPS store location
3. Performance on actual hardware
4. Battery usage during streaming

### Phase 3 (Multi-Device):
1. Real merchant transactions
2. P2P payment testing
3. Concurrent streaming sessions
4. Network resilience

## 🛠️ Quick Test Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npx react-native start

# Run on Android emulator
npx react-native run-android

# Run tests
npm test

# Lint code
npm run lint

# Build release APK
cd android && ./gradlew assembleRelease
```

## 💡 Pro Tips

1. **Use Android emulator** for rapid development
2. **Test on real device** before merchant demos
3. **Mock external services** during development
4. **Use debugging tools** extensively
5. **Gradually increase test complexity**

---

**Bottom Line:** Start with Android emulator on your current computer. You can test 90% of functionality without a second device. Only consider additional hardware when you're ready for real-world merchant pilots.
