import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  LinearProgress,
  Chip
} from '@mui/material';
import { TrendingUp, People, RocketLaunch, Share } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CreatorDashboard = () => {
  const [timeframe, setTimeframe] = useState(7);

  const earnings = {
    totalEarnings: 127.45,
    streamingEarnings: 89.30,
    boostEarnings: 38.15,
    transactions: 156
  };

  const recentBoosts = [
    { amount: 5.0, from: 'alice', message: 'Great episode!', timestamp: Date.now() - 3600000 },
    { amount: 2.5, from: 'bob', message: 'Love this content!', timestamp: Date.now() - 7200000 },
    { amount: 10.0, from: 'charlie', message: 'More like this please!', timestamp: Date.now() - 10800000 },
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Earnings (PEAK)',
        data: [12, 19, 15, 25, 22, 18, 24],
        borderColor: '#1E88E5',
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Earnings Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          🎨 Creator Dashboard
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Earnings Overview */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  💰 Earnings Overview
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary" fontWeight={700}>
                        {earnings.totalEarnings.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total PEAK Earned
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        +15.2% vs last week
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main" fontWeight={700}>
                        {earnings.streamingEarnings.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Streaming Payments
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        70% of total earnings
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main" fontWeight={700}>
                        {earnings.boostEarnings.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Boost Messages
                      </Typography>
                      <Typography variant="caption" color="warning.main">
                        30% of total earnings
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main" fontWeight={700}>
                        {earnings.transactions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Transactions
                      </Typography>
                      <Typography variant="caption" color="info.main">
                        +23 this week
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Earnings Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📈 Earnings Trend
                </Typography>
                <Line data={chartData} options={chartOptions} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Active Streams */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🎵 Active Streams
                </Typography>
                
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="primary" fontWeight={700}>
                      23
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Listeners
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Rate: 0.12 PEAK/min
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Typography variant="body2" color="success.main" fontWeight={600}>
                  Earning 2.8 PEAK/hour right now! 🚀
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Boosts */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  💬 Recent Boosts
                </Typography>
                
                {recentBoosts.map((boost, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #f0f0f0', borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" color="warning.main" fontWeight={600}>
                        🚀 {boost.amount} PEAK
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        from @{boost.from}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                      "{boost.message}"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(boost.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Creator Tools */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="hover-lift">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  🔗 Creator Tools
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      startIcon={<Share />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      Share V4V Link
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<TrendingUp />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      Analytics
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="success"
                      startIcon={<People />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      Supporters
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="warning"
                      startIcon={<RocketLaunch />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      Promote
                    </Button>
                  </Grid>
                </Grid>

                <Box mt={3} p={2} sx={{ background: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    🔗 Your V4V Link:
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace' }}>
                    peakecoin.v4v/your-creator-name
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Share this link to enable V4V payments on your content
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorDashboard;
