import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  TextInput,
  FlatList
} from 'react-native';
import { V4VService } from '../services/V4VService';
import PriceService from '../services/PriceService';

const ContentDiscoveryScreen = ({ navigation }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [peakPrice, setPeakPrice] = useState(0);

  const v4vService = new V4VService();
  const priceService = PriceService;

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'podcast', name: 'Podcasts', icon: '🎙️' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'video', name: 'Videos', icon: '📹' },
    { id: 'article', name: 'Articles', icon: '📰' },
    { id: 'stream', name: 'Live', icon: '🔴' }
  ];

  useEffect(() => {
    loadContent();
    loadPeakPrice();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const discoveredContent = await v4vService.discoverContent();
      setContent(discoveredContent);
    } catch (error) {
      console.error('Error loading content:', error);
      Alert.alert('Error', 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadPeakPrice = async () => {
    try {
      const price = await priceService.getPeakeCoinPrice();
      setPeakPrice(price);
    } catch (error) {
      console.error('Error loading PEAK price:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    await loadPeakPrice();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return (amount * peakPrice).toFixed(2);
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const startV4VSession = (contentItem) => {
    navigation.navigate('V4VPlayer', { content: contentItem });
  };

  const renderContentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contentItem}
      onPress={() => startV4VSession(item)}
    >
      <View style={styles.contentHeader}>
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <Text style={styles.contentCreator}>by @{item.creator}</Text>
          <Text style={styles.contentDescription}>{item.description}</Text>
        </View>
        <View style={styles.contentStats}>
          <Text style={styles.contentType}>
            {categories.find(c => c.id === item.type)?.icon} {item.type}
          </Text>
          <Text style={styles.contentDuration}>
            {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
      
      <View style={styles.contentFooter}>
        <View style={styles.rateInfo}>
          <Text style={styles.suggestedRate}>
            💰 {item.suggestedRate} PEAK/min
          </Text>
          <Text style={styles.suggestedRateUsd}>
            (${formatCurrency(item.suggestedRate)}/min)
          </Text>
        </View>
        <View style={styles.contentMetrics}>
          <Text style={styles.listenersCount}>
            👥 {item.listeners} listening
          </Text>
          <Text style={styles.totalEarned}>
            📈 {item.totalEarned.toFixed(1)} PEAK earned
          </Text>
        </View>
      </View>
      
      <View style={styles.tagContainer}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category) => (
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
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover V4V Content</Text>
        <TouchableOpacity 
          style={styles.creatorButton}
          onPress={() => navigation.navigate('CreatorDashboard')}
        >
          <Text style={styles.creatorButtonText}>🎨 Creator Mode</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search creators, content, or tags..."
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
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {/* Content List */}
      <FlatList
        data={filteredContent}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.contentList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading content...' : 'No content found'}
            </Text>
            {!loading && (
              <TouchableOpacity style={styles.refreshButton} onPress={loadContent}>
                <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <Text style={styles.infoText}>
          💡 Tap any content to start V4V streaming payments
        </Text>
        <Text style={styles.priceInfo}>
          PEAK Price: ${peakPrice.toFixed(4)}
        </Text>
      </View>
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
  creatorButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  creatorButtonText: {
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
  contentList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  contentItem: {
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
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  contentInfo: {
    flex: 1,
    marginRight: 15,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  contentCreator: {
    fontSize: 14,
    color: '#1E88E5',
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  contentStats: {
    alignItems: 'flex-end',
  },
  contentType: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 5,
  },
  contentDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rateInfo: {
    flex: 1,
  },
  suggestedRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  suggestedRateUsd: {
    fontSize: 12,
    color: '#666666',
  },
  contentMetrics: {
    alignItems: 'flex-end',
  },
  listenersCount: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  totalEarned: {
    fontSize: 12,
    color: '#1E88E5',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1E88E5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
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
  bottomInfo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 5,
  },
  priceInfo: {
    fontSize: 12,
    color: '#1E88E5',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ContentDiscoveryScreen;
