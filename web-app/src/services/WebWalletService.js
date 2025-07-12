import axios from 'axios';

class WebWalletService {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api'; // Payment gateway API
    this.balance = 1247.89; // Mock balance for demo
    this.transactions = [
      { id: 1, type: 'receive', amount: 25.50, from: 'awesome-podcaster', memo: 'V4V_BOOST: Thanks for the great content!', timestamp: new Date().toISOString() },
      { id: 2, type: 'send', amount: 5.00, to: 'crypto-musician', memo: 'V4V_STREAM: Decentralized Dreams', timestamp: new Date().toISOString() },
      { id: 3, type: 'receive', amount: 100.00, from: 'crypto-cafe-midtown', memo: 'Coffee purchase refund', timestamp: new Date().toISOString() },
      { id: 4, type: 'send', amount: 15.99, to: 'neo-pizza-downtown', memo: 'Pizza delivery payment', timestamp: new Date().toISOString() },
    ];
  }

  async getBalance() {
    try {
      // In a real implementation, this would fetch from your backend
      // const response = await axios.get(`${this.apiUrl}/balance`);
      // return response.data.balance;
      
      // Mock response for demo
      return {
        peak: this.balance,
        usd: this.balance * 0.334, // Mock exchange rate
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async getTransactions(limit = 10) {
    try {
      // Mock response for demo
      return this.transactions.slice(0, limit);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async sendPayment(to, amount, memo = '') {
    try {
      // In a real implementation:
      // const response = await axios.post(`${this.apiUrl}/payment`, {
      //   to,
      //   amount,
      //   memo,
      //   token: 'PEAK'
      // });

      // Mock successful payment
      const transaction = {
        id: Date.now(),
        type: 'send',
        amount: parseFloat(amount),
        to,
        memo,
        timestamp: new Date().toISOString(),
        txHash: '0x' + Math.random().toString(16).substr(2, 64)
      };

      this.transactions.unshift(transaction);
      this.balance -= parseFloat(amount);

      return {
        success: true,
        transaction,
        newBalance: this.balance
      };
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  async sendV4VPayment(creator, amount, type = 'stream', contentId = null) {
    try {
      const memo = type === 'boost' 
        ? `V4V_BOOST: ${contentId || 'general support'}`
        : `V4V_STREAM: ${contentId || 'live stream'}`;

      return await this.sendPayment(creator, amount, memo);
    } catch (error) {
      console.error('Error sending V4V payment:', error);
      throw error;
    }
  }

  async generateQRCode(type, data) {
    try {
      let qrData = '';
      
      switch (type) {
        case 'payment':
          qrData = `peakecoin:pay?to=${data.to}&amount=${data.amount}&memo=${encodeURIComponent(data.memo || '')}`;
          break;
        case 'v4v':
          qrData = `peakecoin:v4v?creator=${data.creator}&content=${data.content || ''}&boost=${data.boost || false}`;
          break;
        case 'merchant':
          qrData = `peakecoin:merchant?store=${data.store}&register=${data.register || ''}`;
          break;
        default:
          throw new Error('Invalid QR code type');
      }

      return {
        qrData,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  // Get price in USD
  async getPriceInUSD() {
    try {
      // Mock exchange rate - in reality, fetch from CoinGecko or similar
      return 0.334; // $0.334 per PEAK
    } catch (error) {
      console.error('Error fetching price:', error);
      return 0.334; // Fallback price
    }
  }

  // Validate address format
  validateAddress(address) {
    // Basic validation for Hive usernames
    const hiveUsernameRegex = /^[a-z0-9.-]{3,16}$/;
    return hiveUsernameRegex.test(address);
  }
}

export default new WebWalletService();
