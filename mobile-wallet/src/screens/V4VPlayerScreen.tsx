import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  Animated
} from 'react-native';
import { V4VService } from '../services/V4VService';
import PriceService from '../services/PriceService';

const V4VPlayerScreen = ({ navigation, route }) => {
  const { content } = route.params;
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingRate, setStreamingRate] = useState(content.suggestedRate);
  const [sessionId, setSessionId] = useState(null);
  const [totalSent, setTotalSent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostAmount, setBoostAmount] = useState('5.0');
  const [boostMessage, setBoostMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [peakPrice, setPeakPrice] = useState(0);

  const v4vService = new V4VService();
  const priceService = PriceService;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadPeakPrice();
    return () => {
      // Cleanup streaming session on unmount
      if (sessionId) {
        v4vService.stopStreaming(sessionId);
      }
    };
  }, []);

  useEffect(() => {
    // Simulate content progress
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= content.duration) {
            setIsPlaying(false);
            if (isStreaming) {
              stopStreaming();
            }
            return content.duration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, content.duration]);

  useEffect(() => {
    // Update progress animation
    const progress = currentTime / content.duration;
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentTime]);

  useEffect(() => {
    // Pulse animation for streaming indicator
    if (isStreaming) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(pulse);
      };
      pulse();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isStreaming]);

  const loadPeakPrice = async () => {
    try {
      const price = await priceService.getPeakeCoinPrice();
      setPeakPrice(price);
    } catch (error) {
      console.error('Error loading PEAK price:', error);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const startStreaming = async () => {
    try {
      const newSessionId = await v4vService.startStreaming(
        content.creator,
        streamingRate,
        content.id,
        { title: content.title, type: content.type }
      );
      setSessionId(newSessionId);
      setIsStreaming(true);
      
      // Start monitoring session
      const monitorInterval = setInterval(() => {
        const session = v4vService.getStreamSession(newSessionId);
        if (session) {
          setTotalSent(session.totalSent);
        }
      }, 1000);

      Alert.alert(
        'Streaming Started',
        `Now streaming ${streamingRate} PEAK/min to @${content.creator}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error starting streaming:', error);
      Alert.alert('Error', error.message);
    }
  };

  const stopStreaming = () => {
    if (sessionId) {
      v4vService.stopStreaming(sessionId);
      setIsStreaming(false);
      setSessionId(null);
      
      Alert.alert(
        'Streaming Stopped',
        `Total sent: ${totalSent.toFixed(3)} PEAK to @${content.creator}`,
        [{ text: 'OK' }]
      );
    }
  };

  const adjustStreamingRate = (newRate) => {
    setStreamingRate(newRate);
    if (isStreaming && sessionId) {
      // Restart streaming with new rate
      v4vService.stopStreaming(sessionId);
      setTimeout(() => {
        startStreaming();
      }, 100);
    }
  };

  const sendBoost = async () => {
    try {
      const amount = parseFloat(boostAmount);
      if (isNaN(amount) || amount < 0.1) {
        Alert.alert('Error', 'Minimum boost amount is 0.1 PEAK');
        return;
      }

      await v4vService.sendBoost(
        content.creator,
        amount,
        boostMessage,
        content.id
      );

      Alert.alert(
        'Boost Sent! 🚀',
        `${amount} PEAK sent to @${content.creator}`,
        [{ text: 'OK' }]
      );

      setShowBoostModal(false);
      setBoostMessage('');
      setBoostAmount('5.0');

    } catch (error) {
      console.error('Error sending boost:', error);
      Alert.alert('Error', error.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return (amount * peakPrice).toFixed(4);
  };

  const getStreamingCostPerHour = () => {
    return (streamingRate * 60).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>V4V Player</Text>
      </View>

      {/* Content Info */}
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{content.title}</Text>
        <Text style={styles.contentCreator}>by @{content.creator}</Text>
        <Text style={styles.contentDescription}>{content.description}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(content.duration)}</Text>
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.playbackControls}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={togglePlayback}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* V4V Controls */}
      <View style={styles.v4vContainer}>
        <Text style={styles.v4vTitle}>Value for Value Streaming</Text>
        
        {/* Streaming Rate Selector */}
        <View style={styles.rateContainer}>
          <Text style={styles.rateLabel}>Streaming Rate:</Text>
          <View style={styles.rateButtons}>
            {[0.01, 0.05, 0.1, 0.2].map(rate => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.rateButton,
                  streamingRate === rate && styles.rateButtonActive
                ]}
                onPress={() => adjustStreamingRate(rate)}
              >
                <Text style={[
                  styles.rateButtonText,
                  streamingRate === rate && styles.rateButtonTextActive
                ]}>
                  {rate} PEAK/min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.rateCost}>
            Cost: {getStreamingCostPerHour()} PEAK/hour (${formatCurrency(parseFloat(getStreamingCostPerHour()))}/hour)
          </Text>
        </View>

        {/* Streaming Status */}
        <View style={styles.statusContainer}>
          <Animated.View style={[
            styles.streamingIndicator,
            { transform: [{ scale: pulseAnimation }] }
          ]}>
            <Text style={styles.streamingIndicatorText}>
              {isStreaming ? '🔴 STREAMING' : '⚪ READY'}
            </Text>
          </Animated.View>
          <Text style={styles.totalSent}>
            Total Sent: {totalSent.toFixed(3)} PEAK (${formatCurrency(totalSent)})
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={[
              styles.streamButton,
              isStreaming ? styles.streamButtonStop : styles.streamButtonStart
            ]}
            onPress={isStreaming ? stopStreaming : startStreaming}
          >
            <Text style={styles.streamButtonText}>
              {isStreaming ? '⏹️ Stop Streaming' : '▶️ Start Streaming'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boostButton}
            onPress={() => setShowBoostModal(true)}
          >
            <Text style={styles.boostButtonText}>🚀 Send Boost</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Boost Modal */}
      <Modal
        visible={showBoostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBoostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Boost to @{content.creator}</Text>
            
            <View style={styles.boostForm}>
              <Text style={styles.inputLabel}>Amount (PEAK):</Text>
              <TextInput
                style={styles.amountInput}
                value={boostAmount}
                onChangeText={setBoostAmount}
                keyboardType="decimal-pad"
                placeholder="5.0"
              />
              <Text style={styles.amountUsd}>
                ≈ ${formatCurrency(parseFloat(boostAmount) || 0)}
              </Text>

              <Text style={styles.inputLabel}>Message (optional):</Text>
              <TextInput
                style={styles.messageInput}
                value={boostMessage}
                onChangeText={setBoostMessage}
                placeholder="Great content! Keep it up!"
                multiline
                maxLength={100}
              />
              <Text style={styles.characterCount}>
                {boostMessage.length}/100 characters
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBoostModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendBoostButton}
                onPress={sendBoost}
              >
                <Text style={styles.sendBoostButtonText}>Send Boost</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contentInfo: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  contentCreator: {
    fontSize: 16,
    color: '#1E88E5',
    marginBottom: 10,
  },
  contentDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  playbackControls: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  v4vContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  v4vTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  rateContainer: {
    marginBottom: 20,
  },
  rateLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  rateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  rateButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  rateButtonActive: {
    backgroundColor: '#1E88E5',
  },
  rateButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  rateButtonTextActive: {
    color: '#ffffff',
  },
  rateCost: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  streamingIndicator: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  streamingIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalSent: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  controlButtons: {
    gap: 15,
  },
  streamButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  streamButtonStart: {
    backgroundColor: '#4CAF50',
  },
  streamButtonStop: {
    backgroundColor: '#f44336',
  },
  streamButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boostButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  boostButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  boostForm: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    marginTop: 10,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  amountUsd: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    textAlign: 'right',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    height: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
    marginTop: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  sendBoostButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  sendBoostButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default V4VPlayerScreen;
