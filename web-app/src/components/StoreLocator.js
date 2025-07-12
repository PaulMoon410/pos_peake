import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  TextField,
  Chip,
  Avatar,
  IconButton,
  Rating
} from '@mui/material';
import { 
  LocationOn, 
  Phone, 
  Language, 
  Directions,
  Search,
  FilterList
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stores', icon: '🏪' },
    { id: 'restaurant', name: 'Food', icon: '🍕' },
    { id: 'coffee', name: 'Coffee', icon: '☕' },
    { id: 'retail', name: 'Retail', icon: '🛍️' },
    { id: 'gas', name: 'Gas', icon: '⛽' },
    { id: 'grocery', name: 'Grocery', icon: '🛒' }
  ];

  const stores = [
    {
      id: 1,
      name: 'Neo Pizza Downtown',
      category: 'restaurant',
      address: '123 Main St, Downtown',
      distance: 0.3,
      rating: 4.8,
      isOpen: true,
      phone: '+1-555-0123',
      website: 'https://neopizza.com',
      description: 'Authentic Italian pizza with crypto-friendly payments',
      peakDiscount: 10,
      features: ['takeout', 'delivery', 'dine-in', 'wifi'],
      averagePrice: 15.99
    },
    {
      id: 2,
      name: 'Crypto Café',
      category: 'coffee',
      address: '456 Tech Ave, Midtown',
      distance: 0.7,
      rating: 4.6,
      isOpen: true,
      phone: '+1-555-0456',
      website: 'https://cryptocafe.com',
      description: 'Your neighborhood crypto-themed coffee shop',
      peakDiscount: 15,
      features: ['wifi', 'coworking', 'meetups', 'education'],
      averagePrice: 5.99
    },
    {
      id: 3,
      name: 'Blockchain Books & More',
      category: 'retail',
      address: '789 Learning Ln, University District',
      distance: 1.2,
      rating: 4.5,
      isOpen: false,
      phone: '+1-555-0789',
      website: 'https://blockchainbooks.com',
      description: 'Books, tech gadgets, and crypto merchandise',
      peakDiscount: 8,
      features: ['events', 'workshops', 'online'],
      averagePrice: 29.99
    },
    {
      id: 4,
      name: 'HODL Grocery Market',
      category: 'grocery',
      address: '654 Neighborhood Blvd, Suburbs',
      distance: 1.8,
      rating: 4.7,
      isOpen: true,
      phone: '+1-555-0654',
      website: 'https://hodlgrocery.com',
      description: 'Fresh groceries with cryptocurrency payment options',
      peakDiscount: 12,
      features: ['organic', 'local', 'delivery', 'bulk'],
      averagePrice: 67.50
    }
  ];

  const filteredStores = stores.filter(store => {
    const matchesSearch = searchQuery === '' || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const payWithPeak = (store) => {
    toast.success(`Opening payment for ${store.name} with ${store.peakDiscount}% PEAK discount!`);
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
          🏪 PEAK-Accepting Stores
        </Typography>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                placeholder="Search stores, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
              <Button variant="outlined" startIcon={<FilterList />}>
                Filter
              </Button>
            </Box>
            
            <Box display="flex" gap={1} flexWrap="wrap">
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={`${category.icon} ${category.name}`}
                  onClick={() => setSelectedCategory(category.id)}
                  color={selectedCategory === category.id ? 'primary' : 'default'}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {filteredStores.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stores Found
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    {filteredStores.filter(s => s.distance < 1).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nearby (< 1 mi)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main" fontWeight={700}>
                    {filteredStores.filter(s => s.isOpen).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Now
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Store Grid */}
      <Grid container spacing={3}>
        {filteredStores.map((store, index) => (
          <Grid item xs={12} md={6} key={store.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover-lift">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {store.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {categories.find(c => c.id === store.category)?.icon} {store.category.toUpperCase()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={store.isOpen ? 'OPEN' : 'CLOSED'}
                      color={store.isOpen ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {store.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {store.address} • {store.distance} mi away
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating value={store.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {store.rating}/5.0
                    </Typography>
                  </Box>

                  {/* PEAK Benefits */}
                  <Box sx={{ background: '#f8f9fa', p: 2, borderRadius: 2, mb: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Chip 
                        label="💎 PEAK ACCEPTED" 
                        color="success" 
                        size="small" 
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="body2" color="warning.main" fontWeight={600}>
                      🎉 {store.peakDiscount}% discount with PEAK payments!
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {store.features.slice(0, 4).map((feature) => (
                      <Chip key={feature} label={feature} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      💰 ~${store.averagePrice} average
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => payWithPeak(store)}
                      sx={{ flex: 1 }}
                    >
                      💎 Pay with PEAK
                    </Button>
                    
                    <IconButton 
                      onClick={() => window.open(`tel:${store.phone}`, '_self')}
                      sx={{ border: '1px solid #ddd' }}
                    >
                      <Phone />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(store.address)}`, '_blank')}
                      sx={{ border: '1px solid #ddd' }}
                    >
                      <Directions />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => window.open(store.website, '_blank')}
                      sx={{ border: '1px solid #ddd' }}
                    >
                      <Language />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Add Merchant CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card sx={{ mt: 4, border: '2px dashed #1E88E5' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" color="primary" fontWeight={600} gutterBottom>
              Own a business?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start accepting PeakeCoin payments and join the crypto economy!
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ py: 2, px: 4, borderRadius: 3 }}
            >
              🚀 Become a PEAK Merchant
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default StoreLocator;
