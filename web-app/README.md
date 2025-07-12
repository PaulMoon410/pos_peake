# PeakeCoin V4V Web Platform

A modern web interface for the PeakeCoin Value for Value (V4V) platform, enabling real-life spending and creator support through streaming payments.

## Features

🚀 **Main Features:**
- **Digital Wallet**: Send/receive PeakeCoin with real-time balance tracking
- **V4V Discovery**: Find creators and support them with streaming payments
- **Creator Dashboard**: Analytics and earnings tracking for content creators
- **Store Locator**: Find physical merchants accepting PeakeCoin
- **QR Scanner**: Easy payments through QR code scanning
- **Real-time Updates**: Live transaction feeds and balance updates

💎 **Technical Features:**
- Modern React web app with Material-UI
- Responsive design for mobile and desktop
- Real-time price conversion (PEAK to USD)
- Hive blockchain integration
- Progressive Web App (PWA) ready

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd web-app
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   - Visit: http://localhost:3000
   - The app will automatically reload on changes

### Build for Production

```bash
npm run build
npm run deploy
```

## Project Structure

```
web-app/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   ├── WalletDashboard.js
│   │   ├── V4VDiscovery.js
│   │   ├── CreatorDashboard.js
│   │   ├── StoreLocator.js
│   │   └── QRScanner.js
│   ├── services/     # Business logic
│   │   ├── WebWalletService.js
│   │   └── WebV4VService.js
│   ├── App.js        # Main app component
│   ├── index.js      # Entry point
│   └── index.css     # Global styles
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Build and serve production build

## Backend Integration

The web app is designed to work with:
- **Payment Gateway API**: `http://localhost:3001/api`
- **Hive Blockchain**: Direct integration via hive-js
- **V4V Platform API**: Future endpoint for creator discovery

### Mock Data

Currently runs with mock data for demonstration:
- Sample wallet transactions
- Mock creator profiles
- Simulated V4V payments
- Test QR codes

## Features Demo

### 💰 Wallet Dashboard
- View PeakeCoin balance in PEAK and USD
- Send payments to other users
- Transaction history with V4V categorization
- Real-time balance updates

### 🎵 V4V Discovery  
- Browse live creators and content
- Send streaming payments while listening
- Boost creators with one-time payments
- Search and filter content

### 📊 Creator Dashboard
- Earnings analytics and growth metrics
- Content performance tracking
- Fan engagement statistics
- Payment history and insights

### 🏪 Store Locator
- Find nearby merchants accepting PeakeCoin
- View store details and payment options
- Integration with maps and directions
- QR code payment generation

### 📱 QR Scanner
- Scan payment QR codes
- Support for V4V, merchant, and standard payments
- Manual QR code entry
- Real-time payment processing

## Integration with Mobile App

This web app complements the React Native mobile wallet:
- Shared API endpoints and data models
- Cross-platform user experience
- Synchronized transaction history
- Unified V4V creator ecosystem

## Production Deployment

### Environment Variables
```env
REACT_APP_API_URL=https://api.peakecoin.app
REACT_APP_V4V_API_URL=https://v4v.peakecoin.app
REACT_APP_HIVE_NODE=https://api.hive.blog
```

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: `npm run deploy`
- **Self-hosted**: Use built files from `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Roadmap

- [ ] Real blockchain integration
- [ ] PWA offline support  
- [ ] Multi-language support
- [ ] Advanced creator analytics
- [ ] Merchant onboarding tools
- [ ] Community features

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the main project documentation
- Review the integration guides

---

**Built with ❤️ for the PeakeCoin community**
