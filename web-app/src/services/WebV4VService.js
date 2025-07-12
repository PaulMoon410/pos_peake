import axios from 'axios';

class WebV4VService {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api';
    this.v4vApiUrl = 'https://api.v4v.peakecoin.app'; // Future V4V API endpoint
    
    // Mock data for demo
    this.mockCreators = [
      {
        id: 'awesome-podcaster',
        name: 'Awesome Podcaster',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        category: 'Podcast',
        description: 'Daily crypto and blockchain insights',
        totalEarned: 2847.50,
        followers: 1234,
        isLive: true,
        currentContent: 'Episode 42: The Future of DeFi'
      },
      {
        id: 'crypto-musician',
        name: 'Crypto Musician',
        avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150',
        category: 'Music',
        description: 'Decentralized music for the masses',
        totalEarned: 1523.25,
        followers: 856,
        isLive: false,
        currentContent: 'New Album: Blockchain Symphony'
      },
      {
        id: 'tech-educator',
        name: 'Tech Educator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        category: 'Education',
        description: 'Teaching blockchain development',
        totalEarned: 3241.75,
        followers: 2341,
        isLive: true,
        currentContent: 'Smart Contracts 101'
      }
    ];

    this.mockContent = [
      {
        id: 'content-1',
        creator: 'awesome-podcaster',
        title: 'Episode 42: The Future of DeFi',
        type: 'podcast',
        duration: '45:32',
        earned: 125.50,
        listeners: 234,
        isLive: true
      },
      {
        id: 'content-2',
        creator: 'crypto-musician',
        title: 'Decentralized Dreams',
        type: 'music',
        duration: '3:45',
        earned: 89.25,
        listeners: 156,
        isLive: false
      },
      {
        id: 'content-3',
        creator: 'tech-educator',
        title: 'Smart Contracts 101',
        type: 'video',
        duration: '28:15',
        earned: 203.75,
        listeners: 412,
        isLive: true
      }
    ];
  }

  async getCreators(category = null, limit = 10) {
    try {
      let creators = this.mockCreators;
      
      if (category) {
        creators = creators.filter(creator => 
          creator.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      return creators.slice(0, limit);
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
  }

  async getCreatorContent(creatorId) {
    try {
      return this.mockContent.filter(content => content.creator === creatorId);
    } catch (error) {
      console.error('Error fetching creator content:', error);
      throw error;
    }
  }

  async getLiveContent() {
    try {
      return this.mockContent.filter(content => content.isLive);
    } catch (error) {
      console.error('Error fetching live content:', error);
      throw error;
    }
  }

  async sendStreamPayment(creatorId, amount, contentId = null) {
    try {
      // In real implementation, this would call your payment service
      const payment = {
        id: Date.now(),
        type: 'v4v_stream',
        creator: creatorId,
        amount: parseFloat(amount),
        content: contentId,
        timestamp: new Date().toISOString(),
        memo: `V4V_STREAM: ${contentId || 'live stream'}`
      };

      // Update creator earnings (mock)
      const creator = this.mockCreators.find(c => c.id === creatorId);
      if (creator) {
        creator.totalEarned += parseFloat(amount);
      }

      // Update content earnings (mock)
      if (contentId) {
        const content = this.mockContent.find(c => c.id === contentId);
        if (content) {
          content.earned += parseFloat(amount);
        }
      }

      return {
        success: true,
        payment,
        message: `Sent ${amount} PEAK to ${creatorId}`
      };
    } catch (error) {
      console.error('Error sending stream payment:', error);
      throw error;
    }
  }

  async sendBoostPayment(creatorId, amount, message = '', contentId = null) {
    try {
      const payment = {
        id: Date.now(),
        type: 'v4v_boost',
        creator: creatorId,
        amount: parseFloat(amount),
        content: contentId,
        message,
        timestamp: new Date().toISOString(),
        memo: `V4V_BOOST: ${message || 'Thanks for the great content!'}`
      };

      // Update creator earnings (mock)
      const creator = this.mockCreators.find(c => c.id === creatorId);
      if (creator) {
        creator.totalEarned += parseFloat(amount);
      }

      return {
        success: true,
        payment,
        message: `Boost sent! ${amount} PEAK to ${creatorId}`
      };
    } catch (error) {
      console.error('Error sending boost payment:', error);
      throw error;
    }
  }

  async getCreatorStats(creatorId) {
    try {
      const creator = this.mockCreators.find(c => c.id === creatorId);
      if (!creator) {
        throw new Error('Creator not found');
      }

      // Mock analytics data
      return {
        creator,
        stats: {
          totalEarned: creator.totalEarned,
          totalContent: this.mockContent.filter(c => c.creator === creatorId).length,
          followers: creator.followers,
          avgPerContent: creator.totalEarned / Math.max(1, this.mockContent.filter(c => c.creator === creatorId).length),
          monthlyGrowth: Math.random() * 20 + 5, // Mock growth percentage
          topContent: this.mockContent
            .filter(c => c.creator === creatorId)
            .sort((a, b) => b.earned - a.earned)[0]
        },
        recentPayments: [
          { amount: 5.50, from: 'crypto-enthusiast', message: 'Great content!', timestamp: new Date().toISOString() },
          { amount: 10.00, from: 'blockchain-dev', message: 'Keep it up!', timestamp: new Date().toISOString() },
          { amount: 2.50, from: 'anonymous', message: '', timestamp: new Date().toISOString() }
        ]
      };
    } catch (error) {
      console.error('Error fetching creator stats:', error);
      throw error;
    }
  }

  async searchContent(query, filters = {}) {
    try {
      let results = [...this.mockContent];

      // Filter by query
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(content => 
          content.title.toLowerCase().includes(lowerQuery) ||
          content.creator.toLowerCase().includes(lowerQuery)
        );
      }

      // Filter by type
      if (filters.type) {
        results = results.filter(content => content.type === filters.type);
      }

      // Filter by live status
      if (filters.live !== undefined) {
        results = results.filter(content => content.isLive === filters.live);
      }

      // Sort by earnings or listeners
      if (filters.sortBy === 'earnings') {
        results.sort((a, b) => b.earned - a.earned);
      } else if (filters.sortBy === 'listeners') {
        results.sort((a, b) => b.listeners - a.listeners);
      }

      return results;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }

  // Get categories for filtering
  getContentCategories() {
    return ['Podcast', 'Music', 'Video', 'Education', 'Gaming', 'Art'];
  }

  // Get content types
  getContentTypes() {
    return ['podcast', 'music', 'video', 'stream', 'article'];
  }
}

export default new WebV4VService();
