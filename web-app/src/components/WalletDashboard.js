import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  TrendingUp, 
  Send, 
  Refresh,
  Visibility,
  VisibilityOff,
  QrCode
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import WebWalletService from '../services/WebWalletService';

const WalletDashboard = () => {
  const [balance, setBalance] = useState({ peak: 0, usd: 0 });
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      const [balanceData, transactionData] = await Promise.all([
        WebWalletService.getBalance(),
        WebWalletService.getTransactions(10)
      ]);
      setBalance(balanceData);
      setTransactions(transactionData);
    } catch (error) {
      toast.error('Failed to load wallet data');
      console.error('Error loading wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshBalance = async () => {
    await loadWalletData();
    toast.success('Balance updated!');
  };

  const handleSendTokens = async () => {
    if (!sendAddress || !sendAmount) {
      toast.error('Please enter both address and amount');
      return;
    }

    if (!WebWalletService.validateAddress(sendAddress)) {
      toast.error('Invalid address format');
      return;
    }

    if (parseFloat(sendAmount) > balance.peak) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setIsLoading(true);
      const result = await WebWalletService.sendPayment(sendAddress, sendAmount, 'Web wallet payment');
      
      if (result.success) {
        toast.success(`Sent ${sendAmount} PEAK to ${sendAddress}`);
        setSendAmount('');
        setSendAddress('');
        setBalance(prev => ({ ...prev, peak: result.newBalance, usd: result.newBalance * 0.334 }));
        setTransactions(prev => [result.transaction, ...prev]);
      }
    } catch (error) {
      toast.error('Payment failed');
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          💰 PeakeCoin Wallet
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass hover-lift">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    💎 PEAK Balance
                  </Typography>
                  <Box>
                    <IconButton onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton onClick={handleRefreshBalance} disabled={isLoading}>
                      <Refresh />
                    </IconButton>
                  </Box>
                </Box>
                
                {isLoading && <LinearProgress sx={{ mb: 2 }} />}
                
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E88E5', mb: 1 }}>
                  {showBalance ? `${balance.peak.toFixed(2)}` : '••••••'} PEAK
                </Typography>
                
                <Typography variant="h6" color="text.secondary">
                  {showBalance ? `$${balance.usd.toFixed(2)} USD` : '$••••••'}
                </Typography>
                
                <Box mt={2}>
                  <Chip 
                    icon={<TrendingUp />} 
                    label="+2.4% (24h)" 
                    color="success" 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🚀 Quick Actions
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      startIcon={<Send />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      Send PEAK
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<QrCode />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      Receive
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="success"
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      🎵 Start V4V
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="warning"
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      🏪 Find Stores
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Send Tokens */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  💸 Send PEAK Tokens
                </Typography>
                
                <TextField
                  fullWidth
                  label="Recipient Address"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="username or hive-address"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">PEAK</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleSendTokens}
                  sx={{ py: 1.5, borderRadius: 3 }}
                >
                  Send Tokens
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📋 Recent Transactions
                </Typography>
                
                {transactions.map((tx) => (
                  <Box key={tx.id} sx={{ mb: 2, p: 2, border: '1px solid #f0f0f0', borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 2,
                            bgcolor: tx.type === 'receive' ? '#4CAF50' : '#FF9800'
                          }}
                        >
                          {tx.type === 'receive' ? '📥' : '📤'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {tx.type === 'receive' ? 'Received' : 'Sent'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tx.type === 'receive' ? `from ${tx.from}` : `to ${tx.to}`}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        variant="body1" 
                        fontWeight={600}
                        color={tx.type === 'receive' ? 'success.main' : 'warning.main'}
                      >
                        {tx.type === 'receive' ? '+' : '-'}{tx.amount} PEAK
                      </Typography>
                    </Box>
                    {tx.memo && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {tx.memo}
                      </Typography>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 Wallet Statistics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary" fontWeight={700}>
                        127
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Transactions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main" fontWeight={700}>
                        89.2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PEAK Earned (V4V)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main" fontWeight={700}>
                        156.7
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PEAK Spent (Stores)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main" fontWeight={700}>
                        23
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Creators Supported
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WalletDashboard;
