import { Client } from '@hiveio/hive-js';
import axios from 'axios';

class HiveEngineService {
  constructor() {
    this.client = new Client([
      'https://api.hive.blog',
      'https://api.hivekings.com',
      'https://anyx.io'
    ]);
    this.engineAPI = 'https://engine.rishipanthee.com';
    this.contractAPI = 'https://api.hive-engine.com/rpc';
  }

  /**
   * Get PeakeCoin balance for a Hive account
   */
  async getPeakeCoinBalance(account) {
    try {
      const response = await axios.post(this.contractAPI, {
        jsonrpc: '2.0',
        method: 'find',
        params: {
          contract: 'tokens',
          table: 'balances',
          query: {
            account: account,
            symbol: 'PEAK'
          }
        },
        id: 1
      });

      if (response.data.result && response.data.result.length > 0) {
        return parseFloat(response.data.result[0].balance);
      }
      return 0;
    } catch (error) {
      console.error('Error fetching PEAK balance:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for PeakeCoin
   */
  async getTransactionHistory(account, limit = 50) {
    try {
      const response = await axios.post(this.contractAPI, {
        jsonrpc: '2.0',
        method: 'find',
        params: {
          contract: 'tokens',
          table: 'contractsBalances',
          query: {
            account: account
          },
          limit: limit,
          offset: 0,
          indexes: [{ index: '_id', descending: true }]
        },
        id: 1
      });

      // Get transaction history from Hive blockchain
      const hiveHistory = await this.client.database.call('get_account_history', [
        account,
        -1,
        limit,
        'custom_json'
      ]);

      const peakTransactions = hiveHistory
        .filter(([, transaction]) => {
          const op = transaction.op;
          if (op[0] === 'custom_json' && op[1].id === 'ssc-mainnet-hive') {
            try {
              const json = JSON.parse(op[1].json);
              return json.contractName === 'tokens' && 
                     (json.contractAction === 'transfer' || 
                      json.contractAction === 'transferToContract') &&
                     json.contractPayload.symbol === 'PEAK';
            } catch (e) {
              return false;
            }
          }
          return false;
        })
        .map(([, transaction]) => {
          const op = transaction.op[1];
          const json = JSON.parse(op.json);
          const payload = json.contractPayload;
          
          return {
            id: transaction.transaction_id,
            timestamp: transaction.timestamp,
            type: payload.to === account ? 'received' : 'sent',
            amount: parseFloat(payload.quantity),
            from: payload.from || account,
            to: payload.to,
            memo: payload.memo || '',
            symbol: 'PEAK'
          };
        });

      return peakTransactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  /**
   * Transfer PeakeCoin to another account
   */
  async transferPeakCoin(from, to, amount, memo = '', activeKey) {
    try {
      const transferPayload = {
        contractName: 'tokens',
        contractAction: 'transfer',
        contractPayload: {
          symbol: 'PEAK',
          to: to,
          quantity: amount.toString(),
          memo: memo
        }
      };

      const customJson = {
        required_auths: [from],
        required_posting_auths: [],
        id: 'ssc-mainnet-hive',
        json: JSON.stringify(transferPayload)
      };

      const result = await this.client.broadcast.customJson(
        customJson,
        activeKey
      );

      return {
        success: true,
        transactionId: result.id,
        blockNum: result.block_num
      };
    } catch (error) {
      console.error('Error transferring PEAK:', error);
      throw error;
    }
  }

  /**
   * Create a payment request for real-world spending
   */
  async createPaymentRequest(merchantAccount, amount, description) {
    try {
      // Generate unique payment identifier
      const paymentId = `peak_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create memo with payment details
      const paymentMemo = JSON.stringify({
        type: 'payment_request',
        paymentId: paymentId,
        amount: amount,
        description: description,
        timestamp: new Date().toISOString(),
        merchantAccount: merchantAccount
      });

      return {
        paymentId,
        merchantAccount,
        amount,
        description,
        memo: paymentMemo,
        qrData: {
          type: 'hive_engine_payment',
          symbol: 'PEAK',
          to: merchantAccount,
          amount: amount,
          memo: paymentMemo
        }
      };
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw error;
    }
  }

  /**
   * Process payment for real-world spending
   */
  async processPayment(customerAccount, paymentRequest, activeKey) {
    try {
      const result = await this.transferPeakCoin(
        customerAccount,
        paymentRequest.merchantAccount,
        paymentRequest.amount,
        paymentRequest.memo,
        activeKey
      );

      if (result.success) {
        return {
          success: true,
          paymentId: paymentRequest.paymentId,
          transactionId: result.transactionId,
          blockNum: result.blockNum,
          amount: paymentRequest.amount,
          merchant: paymentRequest.merchantAccount,
          timestamp: new Date().toISOString()
        };
      }

      throw new Error('Payment failed');
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Get current PEAK token information
   */
  async getTokenInfo() {
    try {
      const response = await axios.post(this.contractAPI, {
        jsonrpc: '2.0',
        method: 'findOne',
        params: {
          contract: 'tokens',
          table: 'tokens',
          query: {
            symbol: 'PEAK'
          }
        },
        id: 1
      });

      return response.data.result;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  /**
   * Get PEAK price in various currencies
   */
  async getPeakPrice() {
    try {
      // Get PEAK market data from Hive Engine
      const response = await axios.post(this.contractAPI, {
        jsonrpc: '2.0',
        method: 'find',
        params: {
          contract: 'market',
          table: 'metrics',
          query: {
            symbol: 'PEAK'
          }
        },
        id: 1
      });

      if (response.data.result && response.data.result.length > 0) {
        const metrics = response.data.result[0];
        
        // Get HIVE price in USD (you might want to use a real API for this)
        const hivePrice = await this.getHivePrice();
        
        return {
          peakPriceHive: parseFloat(metrics.lastPrice || 0),
          peakPriceUSD: parseFloat(metrics.lastPrice || 0) * hivePrice,
          volume24h: parseFloat(metrics.volume || 0),
          priceChange24h: parseFloat(metrics.priceChangePercent || 0)
        };
      }

      return {
        peakPriceHive: 0,
        peakPriceUSD: 0,
        volume24h: 0,
        priceChange24h: 0
      };
    } catch (error) {
      console.error('Error fetching PEAK price:', error);
      throw error;
    }
  }

  /**
   * Get current HIVE price in USD
   */
  async getHivePrice() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd');
      return response.data.hive.usd;
    } catch (error) {
      console.error('Error fetching HIVE price:', error);
      return 0.3; // Fallback price
    }
  }

  /**
   * Validate Hive account name
   */
  validateAccount(account) {
    const accountRegex = /^[a-z][a-z0-9\.\-]{2,15}$/;
    return accountRegex.test(account);
  }

  /**
   * Get account information from Hive blockchain
   */
  async getAccountInfo(account) {
    try {
      const [accountData] = await this.client.database.getAccounts([account]);
      return accountData;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }
}

export default new HiveEngineService();
