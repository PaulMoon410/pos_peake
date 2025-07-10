import EncryptedStorage from 'react-native-encrypted-storage';
import HiveEngineService from './HiveEngineService';
import { generateSecureRandom } from 'react-native-keychain';

class WalletService {
  constructor() {
    this.currentAccount = null;
    this.isInitialized = false;
  }

  /**
   * Initialize wallet service
   */
  async initialize() {
    try {
      const savedAccount = await EncryptedStorage.getItem('hive_account');
      if (savedAccount) {
        this.currentAccount = JSON.parse(savedAccount);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing wallet:', error);
    }
  }

  /**
   * Create or import Hive account for PeakeCoin wallet
   */
  async setupAccount(accountName, activeKey, memoKey) {
    try {
      // Validate account name
      if (!HiveEngineService.validateAccount(accountName)) {
        throw new Error('Invalid account name format');
      }

      // Verify account exists on Hive blockchain
      const accountInfo = await HiveEngineService.getAccountInfo(accountName);
      if (!accountInfo) {
        throw new Error('Account not found on Hive blockchain');
      }

      // Store account information securely
      const accountData = {
        username: accountName,
        activeKey: activeKey, // In production, encrypt this
        memoKey: memoKey,
        setupDate: new Date().toISOString()
      };

      await EncryptedStorage.setItem('hive_account', JSON.stringify(accountData));
      this.currentAccount = accountData;

      return { success: true, account: accountName };
    } catch (error) {
      console.error('Error setting up account:', error);
      throw error;
    }
  }

  /**
   * Get current PeakeCoin balance
   */
  async getBalance() {
    try {
      if (!this.currentAccount) {
        await this.initialize();
      }

      if (!this.currentAccount) {
        return 0;
      }

      const balance = await HiveEngineService.getPeakCoinBalance(this.currentAccount.username);
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit = 20) {
    try {
      if (!this.currentAccount) {
        await this.initialize();
      }

      if (!this.currentAccount) {
        return [];
      }

      const transactions = await HiveEngineService.getTransactionHistory(
        this.currentAccount.username, 
        limit
      );
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  /**
   * Send PeakeCoin payment
   */
  async sendPayment(to, amount, memo = '') {
    try {
      if (!this.currentAccount) {
        throw new Error('No account configured');
      }

      const result = await HiveEngineService.transferPeakCoin(
        this.currentAccount.username,
        to,
        amount,
        memo,
        this.currentAccount.activeKey
      );

      return result;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  /**
   * Process QR code payment (for real-world spending)
   */
  async processQRPayment(qrData) {
    try {
      if (!this.currentAccount) {
        throw new Error('No account configured');
      }

      // Parse QR code data
      let paymentData;
      if (typeof qrData === 'string') {
        paymentData = JSON.parse(qrData);
      } else {
        paymentData = qrData;
      }

      // Validate payment data
      if (paymentData.type !== 'hive_engine_payment' || paymentData.symbol !== 'PEAK') {
        throw new Error('Invalid payment QR code');
      }

      // Create payment request
      const paymentRequest = await HiveEngineService.createPaymentRequest(
        paymentData.to,
        paymentData.amount,
        paymentData.memo || 'PeakeCoin Payment'
      );

      // Process the payment
      const result = await HiveEngineService.processPayment(
        this.currentAccount.username,
        paymentRequest,
        this.currentAccount.activeKey
      );

      return result;
    } catch (error) {
      console.error('Error processing QR payment:', error);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo() {
    try {
      if (!this.currentAccount) {
        await this.initialize();
      }

      if (!this.currentAccount) {
        return null;
      }

      const accountInfo = await HiveEngineService.getAccountInfo(this.currentAccount.username);
      const balance = await this.getBalance();
      
      return {
        ...accountInfo,
        peakCoinBalance: balance,
        username: this.currentAccount.username
      };
    } catch (error) {
      console.error('Error getting account info:', error);
      return null;
    }
  }

  /**
   * Get current account username
   */
  getCurrentAccount() {
    return this.currentAccount ? this.currentAccount.username : null;
  }

  /**
   * Check if wallet is set up
   */
  isWalletSetup() {
    return this.currentAccount !== null;
  }

  /**
   * Logout and clear stored data
   */
  async logout() {
    try {
      await EncryptedStorage.removeItem('hive_account');
      this.currentAccount = null;
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Generate payment QR code for receiving payments
   */
  generateReceiveQR(amount, memo = '') {
    if (!this.currentAccount) {
      throw new Error('No account configured');
    }

    const qrData = {
      type: 'hive_engine_payment',
      symbol: 'PEAK',
      to: this.currentAccount.username,
      amount: amount,
      memo: memo,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(qrData);
  }

  /**
   * Validate if an amount can be sent (check balance)
   */
  async canSendAmount(amount) {
    try {
      const balance = await this.getBalance();
      return balance >= amount;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }
}

export default new WalletService();
