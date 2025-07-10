import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WalletService } from '../services/WalletService';
import { PriceService } from '../services/PriceService';

const WalletScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [fiatBalance, setFiatBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      // Load PeakeCoin balance
      const peakBalance = await WalletService.getBalance();
      setBalance(peakBalance);

      // Convert to fiat
      const priceInUSD = await PriceService.getPeakeCoinPrice('USD');
      setFiatBalance(peakBalance * priceInUSD);

      // Load recent transactions
      const transactions = await WalletService.getRecentTransactions();
      setRecentTransactions(transactions);
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
    }).format(amount);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadWalletData} />
      }
    >
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.peakBalance}>
          {balance.toFixed(4)} PEAK
        </Text>
        <Text style={styles.fiatBalance}>
          {formatCurrency(fiatBalance)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Pay')}
        >
          <Icon name="qr-code-scanner" size={24} color="#fff" />
          <Text style={styles.actionText}>Scan & Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Stores')}
        >
          <Icon name="store" size={24} color="#fff" />
          <Text style={styles.actionText}>Find Stores</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionHistory')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Icon
                name={transaction.type === 'sent' ? 'arrow-upward' : 'arrow-downward'}
                size={20}
                color={transaction.type === 'sent' ? '#f44336' : '#4caf50'}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {transaction.type === 'sent' ? 'Payment Sent' : 'Payment Received'}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.timestamp).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text
                style={[
                  styles.transactionAmountText,
                  { color: transaction.type === 'sent' ? '#f44336' : '#4caf50' }
                ]}
              >
                {transaction.type === 'sent' ? '-' : '+'}
                {transaction.amount.toFixed(4)} PEAK
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    backgroundColor: '#2196F3',
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 5,
  },
  peakBalance: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fiatBalance: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 0.48,
    backgroundColor: '#4caf50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WalletScreen;
