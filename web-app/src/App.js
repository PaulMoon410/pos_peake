import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, AccountBalanceWallet, MusicNote, Store, Dashboard, QrCode } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import components
import WalletDashboard from './components/WalletDashboard';
import V4VDiscovery from './components/V4VDiscovery';
import CreatorDashboard from './components/CreatorDashboard';
import StoreLocator from './components/StoreLocator';
import QRScanner from './components/QRScanner';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('wallet');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const navigation = [
    { id: 'wallet', label: 'Wallet', icon: <AccountBalanceWallet />, component: WalletDashboard },
    { id: 'v4v', label: 'V4V Discovery', icon: <MusicNote />, component: V4VDiscovery },
    { id: 'creator', label: 'Creator Dashboard', icon: <Dashboard />, component: CreatorDashboard },
    { id: 'stores', label: 'Store Locator', icon: <Store />, component: StoreLocator },
    { id: 'scan', label: 'QR Scanner', icon: <QrCode />, component: QRScanner },
  ];

  const currentComponent = navigation.find(nav => nav.id === currentPage)?.component || WalletDashboard;
  const CurrentComponent = currentComponent;

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <Typography variant="h4" gutterBottom>
            🚀 PeakeCoin V4V
          </Typography>
          <Typography variant="body1">
            Loading Value for Value Platform...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            💎 PeakeCoin V4V Platform
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navigation.map((nav) => (
              <Button
                key={nav.id}
                color="inherit"
                startIcon={nav.icon}
                onClick={() => setCurrentPage(nav.id)}
                sx={{
                  mx: 1,
                  backgroundColor: currentPage === nav.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {nav.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: 700 }}>
            💎 PeakeCoin V4V
          </Typography>
          <List>
            {navigation.map((nav) => (
              <ListItem
                button
                key={nav.id}
                onClick={() => {
                  setCurrentPage(nav.id);
                  setDrawerOpen(false);
                }}
                selected={currentPage === nav.id}
              >
                <ListItemIcon>{nav.icon}</ListItemIcon>
                <ListItemText primary={nav.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentComponent />
        </motion.div>
      </Container>

      {/* Footer */}
      <Box 
        sx={{ 
          mt: 4, 
          py: 3, 
          background: 'rgba(0,0,0,0.1)', 
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2">
          🚀 Built with PeakeCoin V4V Platform • Powered by Hive Blockchain
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Supporting creators through Value for Value payments since 2025
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
