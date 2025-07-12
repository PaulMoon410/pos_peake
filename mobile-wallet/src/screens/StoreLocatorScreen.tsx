import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Image,
  Linking,
  Dimensions
} from 'react-native';
import WalletService from '../services/WalletService';
import PriceService from '../services/PriceService';

const { width } = Dimensions.get('window');

const StoreLocatorScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [nearbyStores, setNearbyStores] = useState([]);

  const walletService = WalletService;
  const priceService = PriceService;

  const categories = [
    { id: 'all', name: 'All Stores', icon: '🏪' },
    { id: 'restaurant', name: 'Restaurants', icon: '🍕' },
    { id: 'coffee', name: 'Coffee', icon: '☕' },
    { id: 'retail', name: 'Retail', icon: '🛍️' },
    { id: 'gas', name: 'Gas', icon: '⛽' },
    { id: 'grocery', name: 'Grocery', icon: '🛒' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮' }
  ];

  useEffect(() => {
    loadStores();
    loadNearbyStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      // Mock store data - in real app, this would come from an API
      const mockStores = [
        {
          id: 'neo-pizza-downtown',
          name: 'Neo Pizza Downtown',
          category: 'restaurant',
          address: '123 Main St, Downtown',
          distance: 0.3,
          rating: 4.8,
          isOpen: true,
          acceptsPeak: true,
          phone: '+1-555-0123',
          website: 'https://neopizza.com',
          description: 'Authentic Italian pizza with crypto-friendly payments',
          peakDiscount: 10, // 10% discount for PEAK payments
          image: 'https://example.com/neo-pizza.jpg',
          hours: {
            open: '11:00',
            close: '22:00'
          },
          features: ['takeout', 'delivery', 'dine-in', 'wifi'],
          averagePrice: 15.99,
          peakWalletAddress: 'neo-pizza-downtown'
        },
        {
          id: 'crypto-cafe-midtown',
          name: 'Crypto Café',
          category: 'coffee',
          address: '456 Tech Ave, Midtown',
          distance: 0.7,
          rating: 4.6,
          isOpen: true,
          acceptsPeak: true,
          phone: '+1-555-0456',
          website: 'https://cryptocafe.com',
          description: 'Your neighborhood crypto-themed coffee shop',
          peakDiscount: 15,
          image: 'https://example.com/crypto-cafe.jpg',
          hours: {
            open: '06:00',
            close: '20:00'
          },
          features: ['wifi', 'coworking', 'meetups', 'education'],
          averagePrice: 5.99,
          peakWalletAddress: 'crypto-cafe-midtown'
        },
        {
          id: 'blockchain-bookstore',
          name: 'Blockchain Books & More',
          category: 'retail',
          address: '789 Learning Ln, University District',
          distance: 1.2,
          rating: 4.5,
          isOpen: false,
          acceptsPeak: true,
          phone: '+1-555-0789',
          website: 'https://blockchainbooks.com',
          description: 'Books, tech gadgets, and crypto merchandise',
          peakDiscount: 8,
          image: 'https://example.com/blockchain-books.jpg',
          hours: {
            open: '09:00',
            close: '18:00'
          },
          features: ['events', 'workshops', 'online'],
          averagePrice: 29.99,
          peakWalletAddress: 'blockchain-bookstore'
        },
        {
          id: 'defi-gas-station',
          name: 'DeFi Gas & Go',
          category: 'gas',
          address: '321 Highway 101, Outskirts',
          distance: 2.1,
          rating: 4.2,
          isOpen: true,
          acceptsPeak: true,
          phone: '+1-555-0321',
          website: 'https://defigas.com',
          description: 'First crypto-accepting gas station in the area',
          peakDiscount: 5,
          image: 'https://example.com/defi-gas.jpg',
          hours: {
            open: '24/7',
            close: '24/7'
          },
          features: ['24/7', 'convenience', 'ev-charging', 'atm'],
          averagePrice: 45.00,
          peakWalletAddress: 'defi-gas-station'
        },
        {
          id: 'hodl-grocery',
          name: 'HODL Grocery Market',
          category: 'grocery',
          address: '654 Neighborhood Blvd, Suburbs',
          distance: 1.8,
          rating: 4.7,
          isOpen: true,
          acceptsPeak: true,
          phone: '+1-555-0654',
          website: 'https://hodlgrocery.com',
          description: 'Fresh groceries with cryptocurrency payment options',
          peakDiscount: 12,
          image: 'https://example.com/hodl-grocery.jpg',
          hours: {
            open: '07:00',
            close: '21:00'
          },
          features: ['organic', 'local', 'delivery', 'bulk'],
          averagePrice: 67.50,
          peakWalletAddress: 'hodl-grocery'
        }
      ];
      
      setStores(mockStores);
    } catch (error) {
      console.error('Error loading stores:', error);
      Alert.alert('Error', 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyStores = async () => {
    // In a real app, this would use GPS location
    const nearby = stores.filter(store => store.distance < 1.0);
    setNearbyStores(nearby);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStores();
    setRefreshing(false);
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = searchQuery === '' || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const callStore = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openWebsite = (website) => {
    Linking.openURL(website);
  };

  const getDirections = (address) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const payWithPeak = (store) => {
    navigation.navigate('QRPayment', { 
      merchant: store,
      amount: store.averagePrice,
      discount: store.peakDiscount
    });
  };

  const renderStoreItem = (store) => (
    <View key={store.id} style={styles.storeItem}>
      {/* Store Header */}
      <View style={styles.storeHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={[styles.statusBadge, store.isOpen ? styles.openBadge : styles.closedBadge]}>
              <Text style={styles.statusText}>{store.isOpen ? 'OPEN' : 'CLOSED'}</Text>
            </View>
          </View>
          <Text style={styles.storeCategory}>
            {categories.find(c => c.id === store.category)?.icon} {store.category.toUpperCase()}
          </Text>
          <Text style={styles.storeAddress}>📍 {store.address}</Text>
          <Text style={styles.storeDistance}>🚶 {store.distance} mi away</Text>
        </View>
      </View>

      {/* Store Details */}
      <Text style={styles.storeDescription}>{store.description}</Text>
      
      {/* Features */}
      <View style={styles.featuresContainer}>
        {store.features.slice(0, 4).map((feature, index) => (
          <View key={index} style={styles.featureTag}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* PEAK Benefits */}
      <View style={styles.peakBenefits}>
        <View style={styles.peakBadge}>
          <Text style={styles.peakBadgeText}>💎 PEAK ACCEPTED</Text>
        </View>
        <Text style={styles.discountText}>
          🎉 {store.peakDiscount}% discount with PEAK payments!
        </Text>
      </View>

      {/* Rating and Hours */}
      <View style={styles.storeMetrics}>
        <Text style={styles.rating}>⭐ {store.rating}/5.0</Text>
        <Text style={styles.hours}>
          🕒 {store.hours.open === '24/7' ? '24/7' : `${store.hours.open} - ${store.hours.close}`}
        </Text>
        <Text style={styles.averagePrice}>💰 ~${store.averagePrice}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => payWithPeak(store)}
        >
          <Text style={styles.payButtonText}>💎 Pay with PEAK</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => callStore(store.phone)}
          >
            <Text style={styles.actionButtonText}>📞</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => getDirections(store.address)}
          >
            <Text style={styles.actionButtonText}>🗺️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openWebsite(store.website)}
          >
            <Text style={styles.actionButtonText}>🌐</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PEAK-Accepting Stores</Text>
        <TouchableOpacity 
          style={styles.addStoreButton}
          onPress={() => navigation.navigate('MerchantOnboarding')}
        >
          <Text style={styles.addStoreButtonText}>➕ Add Store</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search stores, categories, or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filteredStores.length}</Text>
          <Text style={styles.statLabel}>Stores Found</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{nearbyStores.length}</Text>
          <Text style={styles.statLabel}>Nearby</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filteredStores.filter(s => s.isOpen).length}</Text>
          <Text style={styles.statLabel}>Open Now</Text>
        </View>
      </View>

      {/* Store List */}
      <ScrollView
        style={styles.storeList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading stores...</Text>
          </View>
        ) : filteredStores.length > 0 ? (
          filteredStores.map(renderStoreItem)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stores found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or category filter</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add Merchant CTA */}
        <View style={styles.merchantCTA}>
          <Text style={styles.ctaTitle}>Own a business?</Text>
          <Text style={styles.ctaDescription}>
            Start accepting PeakeCoin payments and join the crypto economy!
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('MerchantOnboarding')}
          >
            <Text style={styles.ctaButtonText}>🚀 Become a PEAK Merchant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1E88E5',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addStoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addStoreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  categoryContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: '#1E88E5',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  storeList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    padding: 50,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  storeItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storeHeader: {
    marginBottom: 15,
  },
  storeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: '#4CAF50',
  },
  closedBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storeCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  storeDistance: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '600',
  },
  storeDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 15,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  featureTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#1E88E5',
  },
  peakBenefits: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  peakBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  peakBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  storeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  hours: {
    fontSize: 14,
    color: '#666666',
  },
  averagePrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  merchantCTA: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E88E5',
    borderStyle: 'dashed',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 10,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StoreLocatorScreen;