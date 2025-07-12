import React, { useState, useEffect } from 'react';
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
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipNext, 
  Favorite, 
  Share,
  Search,
  FilterList,
  RocketLaunch
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const V4VDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [streamingRate, setStreamingRate] = useState(0.1);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [boostAmount, setBoostAmount] = useState(5);
  const [boostMessage, setBoostMessage] = useState('');

  const categories = [
    { id: 'all', name: 'All Content', icon: '🌟' },
    { id: 'podcast', name: 'Podcasts', icon: '🎙️' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'video', name: 'Videos', icon: '📹' },
    { id: 'article', name: 'Articles', icon: '📰' },
    { id: 'live', name: 'Live', icon: '🔴' }
  ];

  const mockContent = [
    {
      id: 1,
      title: 'Crypto Adoption in 2025',
      creator: 'awesome-podcaster',
      type: 'podcast',
      duration: 3600,
      suggestedRate: 0.1,
      description: 'Deep dive into cryptocurrency adoption trends',
      listeners: 234,
      totalEarned: 89.45,
      tags: ['crypto', 'blockchain', 'adoption'],
      thumbnail: '🎙️'
    },
    {
      id: 2,
      title: 'Decentralized Dreams',
      creator: 'crypto-musician',
      type: 'music',
      duration: 240,
      suggestedRate: 0.05,
      description: 'Electronic music inspired by blockchain',
      listeners: 567,
      totalEarned: 156.78,
      tags: ['electronic', 'crypto', 'original'],
      thumbnail: '🎵'
    },
    {
      id: 3,
      title: 'Building on Hive Blockchain',
      creator: 'tech-educator',
      type: 'video',
      duration: 1800,
      suggestedRate: 0.08,
      description: 'Tutorial on Hive blockchain development',
      listeners: 123,
      totalEarned: 67.23,
      tags: ['tutorial', 'hive', 'development'],
      thumbnail: '📹'
    },
    {
      id: 4,
      title: 'DeFi Explained Simply',
      creator: 'crypto-teacher',
      type: 'article',
      duration: 600,
      suggestedRate: 0.02,
      description: 'Easy-to-understand guide to DeFi',
      listeners: 89,
      totalEarned: 23.45,
      tags: ['defi', 'education', 'beginner'],
      thumbnail: '📰'
    }
  ];

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startStreaming = (content) => {
    setCurrentTrack(content);
    setIsPlaying(true);
    toast.success(`Started streaming ${streamingRate} PEAK/min to ${content.creator}`);
  };

  const stopStreaming = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    toast.success('Streaming stopped');
  };

  const sendBoost = () => {
    if (boostAmount < 0.1) {
      toast.error('Minimum boost is 0.1 PEAK');
      return;
    }
    
    toast.success(`🚀 Sent ${boostAmount} PEAK boost to ${currentTrack.creator}!`);
    setShowBoostDialog(false);
    setBoostMessage('');
    setBoostAmount(5);
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
          🎵 V4V Content Discovery
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
                placeholder="Search creators, content, or tags..."
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

      {/* Content Grid */}
      <Grid container spacing={3}>
        {filteredContent.map((content, index) => (
          <Grid item xs={12} md={6} key={content.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover-lift">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, fontSize: '2rem' }}>
                      {content.thumbnail}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {content.title}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        by @{content.creator}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDuration(content.duration)} • {content.listeners} listening
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {content.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2}>
                    {content.tags.map((tag) => (
                      <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      💰 {content.suggestedRate} PEAK/min
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📈 {content.totalEarned.toFixed(1)} PEAK earned
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={currentTrack?.id === content.id && isPlaying ? <Pause /> : <PlayArrow />}
                      onClick={() => currentTrack?.id === content.id && isPlaying ? stopStreaming() : startStreaming(content)}
                      sx={{ flex: 1 }}
                    >
                      {currentTrack?.id === content.id && isPlaying ? 'Stop V4V' : 'Start V4V'}
                    </Button>
                    
                    <IconButton 
                      color="warning"
                      onClick={() => {
                        setCurrentTrack(content);
                        setShowBoostDialog(true);
                      }}
                    >
                      <RocketLaunch />
                    </IconButton>
                    
                    <IconButton>
                      <Favorite />
                    </IconButton>
                    
                    <IconButton>
                      <Share />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Current Playing Card */}
      {currentTrack && isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 20, left: 20, right: 20, zIndex: 1000 }}
        >
          <Card sx={{ background: 'linear-gradient(135deg, #1E88E5, #1565C0)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" color="white">
                  <Avatar sx={{ mr: 2 }}>{currentTrack.thumbnail}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      🔴 Now Streaming: {currentTrack.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Sending {streamingRate} PEAK/min to @{currentTrack.creator}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                  <Box color="white" textAlign="center" minWidth={120}>
                    <Typography variant="caption">Streaming Rate</Typography>
                    <Slider
                      value={streamingRate}
                      onChange={(e, value) => setStreamingRate(value)}
                      min={0.01}
                      max={1}
                      step={0.01}
                      sx={{ color: 'white' }}
                    />
                    <Typography variant="caption">{streamingRate} PEAK/min</Typography>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    onClick={stopStreaming}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Stop
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Boost Dialog */}
      <Dialog open={showBoostDialog} onClose={() => setShowBoostDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          🚀 Send Boost to @{currentTrack?.creator}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Boost Amount"
            type="number"
            value={boostAmount}
            onChange={(e) => setBoostAmount(parseFloat(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">PEAK</InputAdornment>,
            }}
            sx={{ mb: 2, mt: 1 }}
          />
          
          <TextField
            fullWidth
            label="Message (optional)"
            multiline
            rows={3}
            value={boostMessage}
            onChange={(e) => setBoostMessage(e.target.value)}
            placeholder="Great content! Keep it up!"
            helperText={`${boostMessage.length}/100 characters`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBoostDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={sendBoost} color="warning">
            Send Boost 🚀
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default V4VDiscovery;
