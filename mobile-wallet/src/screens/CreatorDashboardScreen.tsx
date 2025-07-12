import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { V4VService } from '../services/V4VService';
import PriceService from '../services/PriceService';

const { width } = Dimensions.get('window');

const CreatorDashboardScreen = ({ navigation }) => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [peakPrice, setPeakPrice] = useState(0);
  const [timeframe, setTimeframe] = useState(7); // 7 days default

  const v4vService = new V4VService();
  const priceService = PriceService;

  useEffect(() => {
    loadDashboardData();
    loadPeakPrice();
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, get creator address from user profile
      const creatorAddress = 'demo-creator';
      const earningsData = await v4vService.getCreatorEarnings(creatorAddress, timeframe);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
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
    await loadDashboardData();
    await loadPeakPrice();
    setRefreshing(false);
  };

  const shareV4VLink = async () => {
    try {
      const result = await Share.share({
        message: 'Support me with PeakeCoin V4V! 🚀\npeakecoin.v4v/demo-creator',
        url: 'https://peakecoin.v4v/demo-creator',
        title: 'Support me on PeakeCoin V4V'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatCurrency = (amount) => {
    return (amount * peakPrice).toFixed(2);
  };

  const generateChartData = () => {
    // Mock data for earnings chart
    const days = Array.from({ length: timeframe }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (timeframe - 1 - i));
      return date.getDate();
    });

    const data = Array.from({ length: timeframe }, () => 
      Math.random() * 20 + 5 // Random earnings between 5-25 PEAK
    );

    return {
      labels: days.map(d => d.toString()),
      datasets: [{
        data: data,
        strokeWidth: 2,
        color: () => '#1E88E5'
      }]
    };
  };

  if (loading && !earnings) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Creator Dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareV4VLink}>
          <Text style={styles.shareButtonText}>📤 Share V4V Link</Text>
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {[7, 30, 90].map(days => (
          <TouchableOpacity
            key={days}
            style={[styles.timeframeButton, timeframe === days && styles.timeframeButtonActive]}
            onPress={() => setTimeframe(days)}
          >
            <Text style={[styles.timeframeButtonText, timeframe === days && styles.timeframeButtonTextActive]}>
              {days}d
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Earnings Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Earnings Overview</Text>
        <View style={styles.earningsGrid}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Text style={styles.earningsValue}>
              {earnings?.totalEarnings?.toFixed(2) || '0.00'} PEAK
            </Text>
            <Text style={styles.earningsUsd}>
              ${formatCurrency(earnings?.totalEarnings || 0)}
            </Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>Streaming</Text>
            <Text style={styles.earningsValue}>
              {earnings?.streamingEarnings?.toFixed(2) || '0.00'} PEAK
            </Text>
            <Text style={styles.earningsUsd}>
              ${formatCurrency(earnings?.streamingEarnings || 0)}
            </Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>Boosts</Text>
            <Text style={styles.earningsValue}>
              {earnings?.boostEarnings?.toFixed(2) || '0.00'} PEAK
            </Text>
            <Text style={styles.earningsUsd}>
              ${formatCurrency(earnings?.boostEarnings || 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Earnings Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Earnings Trend</Text>
        <LineChart
          data={generateChartData()}
          width={width - 60}
          height={200}
          yAxisLabel=""
          yAxisSuffix=" PEAK"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: () => '#1E88E5',
            labelColor: () => '#666666',
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              stroke: '#1E88E5'
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Active Streams */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎵 Active Streams</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Current Listeners</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0.12</Text>
            <Text style={styles.statLabel}>Avg PEAK/min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.8</Text>
            <Text style={styles.statLabel}>PEAK/hour</Text>
          </View>
        </View>
      </View>

      {/* Recent Boosts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💬 Recent Boosts</Text>
        {earnings?.boosts && earnings.boosts.length > 0 ? (
          earnings.boosts.map((boost, index) => (
            <View key={index} style={styles.boostItem}>
              <View style={styles.boostHeader}>
                <Text style={styles.boostAmount}>{boost.amount.toFixed(2)} PEAK</Text>
                <Text style={styles.boostFrom}>from @{boost.from}</Text>
              </View>
              <Text style={styles.boostMessage}>"{boost.message}"</Text>
              <Text style={styles.boostTime}>
                {new Date(boost.timestamp).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBoosts}>No boosts yet. Share your V4V link to get started!</Text>
        )}
      </View>

      {/* Content Management */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎨 Content & Tools</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateContent')}
        >
          <Text style={styles.actionButtonText}>📝 Create New Content</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AnalyticsDetail')}
        >
          <Text style={styles.actionButtonText}>📊 Detailed Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreatorSettings')}
        >
          <Text style={styles.actionButtonText}>⚙️ Creator Settings</Text>
        </TouchableOpacity>
      </View>

      {/* V4V Link */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔗 Your V4V Link</Text>
        <View style={styles.linkContainer}>
          <Text style={styles.v4vLink}>peakecoin.v4v/demo-creator</Text>
          <TouchableOpacity style={styles.copyButton} onPress={shareV4VLink}>
            <Text style={styles.copyButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.linkDescription}>
          Share this link with your audience to enable V4V payments
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
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
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  timeframeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  timeframeButtonActive: {
    backgroundColor: '#1E88E5',
  },
  timeframeButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  timeframeButtonTextActive: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 2,
  },
  earningsUsd: {
    fontSize: 12,
    color: '#888888',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    textAlign: 'center',
  },
  boostItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 10,
  },
  boostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  boostAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  boostFrom: {
    fontSize: 14,
    color: '#666666',
  },
  boostMessage: {
    fontSize: 14,
    color: '#333333',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  boostTime: {
    fontSize: 12,
    color: '#888888',
  },
  noBoosts: {
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  v4vLink: {
    flex: 1,
    fontSize: 16,
    color: '#1E88E5',
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  linkDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default CreatorDashboardScreen;
