/**
 * V4VService - Value for Value payment service for PeakeCoin
 * Handles streaming payments, boosts, and creator interactions
 */

import { HiveEngineService } from './HiveEngineService';
import { WalletService } from './WalletService';

class V4VService {
  constructor() {
    this.hiveEngine = new HiveEngineService();
    this.walletService = new WalletService();
    this.activeStreams = new Map(); // Track active streaming sessions
    this.streamingIntervals = new Map(); // Store interval IDs
  }

  /**
   * Start streaming payments to a creator
   * @param {string} creatorAddress - Creator's wallet address
   * @param {number} ratePerMinute - PEAK tokens per minute
   * @param {string} contentId - Unique content identifier
   * @param {Object} metadata - Content metadata (title, type, etc.)
   */
  async startStreaming(creatorAddress, ratePerMinute, contentId, metadata = {}) {
    try {
      const sessionId = `${contentId}_${Date.now()}`;
      
      // Validate creator address
      if (!creatorAddress || !this.isValidHiveAccount(creatorAddress)) {
        throw new Error('Invalid creator address');
      }

      // Check user balance
      const balance = await this.hiveEngine.getBalance();
      if (balance < ratePerMinute / 60) {
        throw new Error('Insufficient balance for streaming');
      }

      // Create streaming session
      const streamSession = {
        sessionId,
        creatorAddress,
        ratePerMinute,
        contentId,
        metadata,
        startTime: Date.now(),
        totalSent: 0,
        isActive: true
      };

      this.activeStreams.set(sessionId, streamSession);

      // Start interval for payments (every 10 seconds = 1/6 minute)
      const intervalId = setInterval(async () => {
        await this.processStreamingPayment(sessionId);
      }, 10000);

      this.streamingIntervals.set(sessionId, intervalId);

      console.log(`Started streaming to ${creatorAddress} at ${ratePerMinute} PEAK/min`);
      return sessionId;

    } catch (error) {
      console.error('Error starting streaming:', error);
      throw error;
    }
  }

  /**
   * Process a single streaming payment
   * @param {string} sessionId - Streaming session ID
   */
  async processStreamingPayment(sessionId) {
    try {
      const session = this.activeStreams.get(sessionId);
      if (!session || !session.isActive) {
        return;
      }

      // Calculate payment amount (1/6 of rate per minute for 10-second intervals)
      const paymentAmount = session.ratePerMinute / 6;
      
      // Check balance before payment
      const balance = await this.hiveEngine.getBalance();
      if (balance < paymentAmount) {
        console.warn('Insufficient balance, pausing stream');
        this.pauseStreaming(sessionId);
        return;
      }

      // Send micro-payment
      const memo = `V4V_STREAM:${session.contentId}:${session.metadata.title || 'Content'}`;
      await this.hiveEngine.transferTokens(
        session.creatorAddress,
        paymentAmount,
        memo
      );

      // Update session
      session.totalSent += paymentAmount;
      this.activeStreams.set(sessionId, session);

      console.log(`Sent ${paymentAmount} PEAK to ${session.creatorAddress}`);

    } catch (error) {
      console.error('Error processing streaming payment:', error);
    }
  }

  /**
   * Send a boost payment with message
   * @param {string} creatorAddress - Creator's wallet address
   * @param {number} amount - Boost amount in PEAK
   * @param {string} message - Boost message
   * @param {string} contentId - Content identifier
   */
  async sendBoost(creatorAddress, amount, message, contentId) {
    try {
      if (!creatorAddress || !this.isValidHiveAccount(creatorAddress)) {
        throw new Error('Invalid creator address');
      }

      if (amount < 0.1) {
        throw new Error('Minimum boost amount is 0.1 PEAK');
      }

      // Check balance
      const balance = await this.hiveEngine.getBalance();
      if (balance < amount) {
        throw new Error('Insufficient balance for boost');
      }

      // Create boost memo
      const boostMemo = `V4V_BOOST:${contentId}:${message.substring(0, 100)}`;
      
      // Send boost payment
      const result = await this.hiveEngine.transferTokens(
        creatorAddress,
        amount,
        boostMemo
      );

      // Log boost
      const boost = {
        id: Date.now().toString(),
        creatorAddress,
        amount,
        message,
        contentId,
        timestamp: Date.now(),
        txId: result.id
      };

      console.log(`Boost sent: ${amount} PEAK to ${creatorAddress}`);
      return boost;

    } catch (error) {
      console.error('Error sending boost:', error);
      throw error;
    }
  }

  /**
   * Pause streaming payments
   * @param {string} sessionId - Streaming session ID
   */
  pauseStreaming(sessionId) {
    const session = this.activeStreams.get(sessionId);
    if (session) {
      session.isActive = false;
      this.activeStreams.set(sessionId, session);
      
      const intervalId = this.streamingIntervals.get(sessionId);
      if (intervalId) {
        clearInterval(intervalId);
        this.streamingIntervals.delete(sessionId);
      }
      
      console.log(`Streaming paused for session ${sessionId}`);
    }
  }

  /**
   * Resume streaming payments
   * @param {string} sessionId - Streaming session ID
   */
  resumeStreaming(sessionId) {
    const session = this.activeStreams.get(sessionId);
    if (session && !session.isActive) {
      session.isActive = true;
      this.activeStreams.set(sessionId, session);
      
      // Restart interval
      const intervalId = setInterval(async () => {
        await this.processStreamingPayment(sessionId);
      }, 10000);
      
      this.streamingIntervals.set(sessionId, intervalId);
      console.log(`Streaming resumed for session ${sessionId}`);
    }
  }

  /**
   * Stop streaming payments
   * @param {string} sessionId - Streaming session ID
   */
  stopStreaming(sessionId) {
    this.pauseStreaming(sessionId);
    this.activeStreams.delete(sessionId);
    console.log(`Streaming stopped for session ${sessionId}`);
  }

  /**
   * Get active streaming sessions
   */
  getActiveStreams() {
    return Array.from(this.activeStreams.values()).filter(session => session.isActive);
  }

  /**
   * Get streaming session details
   * @param {string} sessionId - Streaming session ID
   */
  getStreamSession(sessionId) {
    return this.activeStreams.get(sessionId);
  }

  /**
   * Get creator earnings (for creator dashboard)
   * @param {string} creatorAddress - Creator's address
   * @param {number} days - Number of days to look back
   */
  async getCreatorEarnings(creatorAddress, days = 7) {
    try {
      const history = await this.hiveEngine.getTransactionHistory(creatorAddress);
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      let totalEarnings = 0;
      let streamingEarnings = 0;
      let boostEarnings = 0;
      const boosts = [];

      history.forEach(tx => {
        if (tx.timestamp > cutoffTime && tx.type === 'receive') {
          totalEarnings += tx.amount;
          
          if (tx.memo && tx.memo.startsWith('V4V_STREAM:')) {
            streamingEarnings += tx.amount;
          } else if (tx.memo && tx.memo.startsWith('V4V_BOOST:')) {
            boostEarnings += tx.amount;
            
            // Parse boost message
            const parts = tx.memo.split(':');
            if (parts.length >= 3) {
              boosts.push({
                amount: tx.amount,
                message: parts[2],
                contentId: parts[1],
                from: tx.from,
                timestamp: tx.timestamp
              });
            }
          }
        }
      });

      return {
        totalEarnings,
        streamingEarnings,
        boostEarnings,
        boosts: boosts.slice(0, 10), // Latest 10 boosts
        transactions: history.filter(tx => 
          tx.timestamp > cutoffTime && tx.type === 'receive'
        ).length
      };

    } catch (error) {
      console.error('Error getting creator earnings:', error);
      throw error;
    }
  }

  /**
   * Discover V4V enabled creators and content
   */
  async discoverContent() {
    try {
      // In a real implementation, this would query a content discovery API
      // For now, return mock data
      return [
        {
          id: 'crypto-podcast-42',
          creator: 'awesome-podcaster',
          title: 'Amazing Podcast Episode #42',
          type: 'podcast',
          duration: 3600, // 60 minutes
          suggestedRate: 0.1, // PEAK per minute
          description: 'Deep dive into crypto adoption and PeakeCoin',
          thumbnail: 'https://example.com/podcast-thumb.jpg',
          tags: ['crypto', 'blockchain', 'peakecoin'],
          listeners: 23,
          totalEarned: 127.45
        },
        {
          id: 'music-track-1',
          creator: 'crypto-musician',
          title: 'Decentralized Dreams',
          type: 'music',
          duration: 240, // 4 minutes
          suggestedRate: 0.05,
          description: 'Electronic music inspired by blockchain technology',
          thumbnail: 'https://example.com/music-thumb.jpg',
          tags: ['electronic', 'crypto', 'original'],
          listeners: 156,
          totalEarned: 89.32
        },
        {
          id: 'tech-review-video',
          creator: 'tech-reviewer',
          title: 'PeakeCoin Mobile Wallet Review',
          type: 'video',
          duration: 720, // 12 minutes
          suggestedRate: 0.02,
          description: 'Comprehensive review of the PeakeCoin mobile wallet',
          thumbnail: 'https://example.com/video-thumb.jpg',
          tags: ['review', 'wallet', 'mobile'],
          listeners: 89,
          totalEarned: 45.67
        }
      ];

    } catch (error) {
      console.error('Error discovering content:', error);
      throw error;
    }
  }

  /**
   * Get recommended streaming rate based on content and creator
   * @param {Object} content - Content metadata
   */
  getRecommendedRate(content) {
    const baseRates = {
      podcast: 0.1,
      music: 0.05,
      video: 0.02,
      article: 0.01,
      stream: 0.15
    };

    return baseRates[content.type] || 0.05;
  }

  /**
   * Validate Hive account name
   * @param {string} account - Account name to validate
   */
  isValidHiveAccount(account) {
    if (!account || typeof account !== 'string') return false;
    
    // Hive account rules: 3-16 characters, lowercase, numbers, hyphens
    const regex = /^[a-z0-9.-]{3,16}$/;
    return regex.test(account);
  }

  /**
   * Format boost message for display
   * @param {string} message - Raw boost message
   */
  formatBoostMessage(message) {
    if (!message) return '';
    
    // Remove V4V prefix if present
    if (message.startsWith('V4V_BOOST:')) {
      const parts = message.split(':');
      return parts.length >= 3 ? parts.slice(2).join(':') : message;
    }
    
    return message;
  }

  /**
   * Calculate total spending on V4V content
   * @param {number} days - Number of days to calculate
   */
  async getTotalSpending(days = 30) {
    try {
      const history = await this.hiveEngine.getTransactionHistory();
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      let totalSpent = 0;
      let streamingSpent = 0;
      let boostSpent = 0;

      history.forEach(tx => {
        if (tx.timestamp > cutoffTime && tx.type === 'send') {
          if (tx.memo && (tx.memo.startsWith('V4V_STREAM:') || tx.memo.startsWith('V4V_BOOST:'))) {
            totalSpent += tx.amount;
            
            if (tx.memo.startsWith('V4V_STREAM:')) {
              streamingSpent += tx.amount;
            } else {
              boostSpent += tx.amount;
            }
          }
        }
      });

      return {
        totalSpent,
        streamingSpent,
        boostSpent,
        averagePerDay: totalSpent / days
      };

    } catch (error) {
      console.error('Error calculating total spending:', error);
      throw error;
    }
  }
}

export { V4VService };
