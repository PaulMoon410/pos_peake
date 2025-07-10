import HiveEngineService from './HiveEngineService';

class PriceService {
  constructor() {
    this.priceCache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
    this.lastUpdate = null;
  }

  /**
   * Get PeakeCoin price in specified currency
   */
  async getPeakeCoinPrice(currency = 'USD') {
    try {
      const cacheKey = `PEAK_${currency}`;
      const cached = this.priceCache.get(cacheKey);
      
      // Return cached price if still valid
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        return cached.price;
      }

      // Get fresh price data from Hive Engine
      const priceData = await HiveEngineService.getPeakPrice();
      
      let price = 0;
      switch (currency.toUpperCase()) {
        case 'USD':
          price = priceData.peakPriceUSD;
          break;
        case 'HIVE':
          price = priceData.peakPriceHive;
          break;
        case 'EUR':
          // Convert USD to EUR (you might want to use a real exchange rate API)
          const usdToEur = await this.getExchangeRate('USD', 'EUR');
          price = priceData.peakPriceUSD * usdToEur;
          break;
        default:
          price = priceData.peakPriceUSD;
      }

      // Cache the price
      this.priceCache.set(cacheKey, {
        price: price,
        timestamp: Date.now()
      });

      return price;
    } catch (error) {
      console.error('Error fetching PEAK price:', error);
      
      // Return cached price if available, otherwise return 0
      const cached = this.priceCache.get(`PEAK_${currency}`);
      return cached ? cached.price : 0;
    }
  }

  /**
   * Get exchange rate between two fiat currencies
   */
  async getExchangeRate(from, to) {
    try {
      const cacheKey = `${from}_${to}`;
      const cached = this.priceCache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        return cached.price;
      }

      // Use a free exchange rate API
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await response.json();
      
      const rate = data.rates[to] || 1;
      
      this.priceCache.set(cacheKey, {
        price: rate,
        timestamp: Date.now()
      });

      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return 1; // Fallback to 1:1 ratio
    }
  }

  /**
   * Convert PeakeCoin amount to fiat currency
   */
  async convertPeakToFiat(peakAmount, currency = 'USD') {
    try {
      const price = await this.getPeakCoinPrice(currency);
      return peakAmount * price;
    } catch (error) {
      console.error('Error converting PEAK to fiat:', error);
      return 0;
    }
  }

  /**
   * Convert fiat currency amount to PeakeCoin
   */
  async convertFiatToPeak(fiatAmount, currency = 'USD') {
    try {
      const price = await this.getPeakCoinPrice(currency);
      if (price === 0) return 0;
      return fiatAmount / price;
    } catch (error) {
      console.error('Error converting fiat to PEAK:', error);
      return 0;
    }
  }

  /**
   * Get comprehensive market data for PeakeCoin
   */
  async getMarketData() {
    try {
      const priceData = await HiveEngineService.getPeakPrice();
      const tokenInfo = await HiveEngineService.getTokenInfo();
      
      return {
        price: {
          usd: priceData.peakPriceUSD,
          hive: priceData.peakPriceHive
        },
        volume24h: priceData.volume24h,
        priceChange24h: priceData.priceChange24h,
        marketCap: tokenInfo ? (parseFloat(tokenInfo.circulatingSupply || 0) * priceData.peakPriceUSD) : 0,
        circulatingSupply: tokenInfo ? parseFloat(tokenInfo.circulatingSupply || 0) : 0,
        maxSupply: tokenInfo ? parseFloat(tokenInfo.maxSupply || 0) : 0,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {
        price: { usd: 0, hive: 0 },
        volume24h: 0,
        priceChange24h: 0,
        marketCap: 0,
        circulatingSupply: 0,
        maxSupply: 0,
        lastUpdate: new Date().toISOString()
      };
    }
  }

  /**
   * Format currency value for display
   */
  formatCurrency(amount, currency = 'USD', decimals = 2) {
    try {
      if (currency === 'PEAK') {
        return `${amount.toFixed(decimals)} PEAK`;
      }

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(amount);
    } catch (error) {
      return `${amount.toFixed(decimals)} ${currency}`;
    }
  }

  /**
   * Clear price cache
   */
  clearCache() {
    this.priceCache.clear();
    this.lastUpdate = null;
  }

  /**
   * Get cached prices for display
   */
  getCachedPrices() {
    const prices = {};
    for (const [key, value] of this.priceCache.entries()) {
      if (key.startsWith('PEAK_')) {
        const currency = key.replace('PEAK_', '');
        prices[currency] = {
          price: value.price,
          lastUpdate: new Date(value.timestamp).toISOString()
        };
      }
    }
    return prices;
  }

  /**
   * Calculate payment amount in preferred currency
   */
  async calculatePaymentAmount(baseAmount, baseCurrency, targetCurrency) {
    try {
      if (baseCurrency === targetCurrency) {
        return baseAmount;
      }

      if (baseCurrency === 'PEAK') {
        return await this.convertPeakToFiat(baseAmount, targetCurrency);
      } else if (targetCurrency === 'PEAK') {
        return await this.convertFiatToPeak(baseAmount, baseCurrency);
      } else {
        // Fiat to fiat conversion
        const rate = await this.getExchangeRate(baseCurrency, targetCurrency);
        return baseAmount * rate;
      }
    } catch (error) {
      console.error('Error calculating payment amount:', error);
      return baseAmount;
    }
  }
}

export default new PriceService();
