import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Modal,
  ActivityIndicator,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from 'react-native-flash-message';
import WalletService from '../services/WalletService';
import PriceService from '../services/PriceService';

const ScannerScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Check if wallet is set up
    const checkWalletSetup = async () => {
      if (!WalletService.isWalletSetup()) {
        Alert.alert(
          'Wallet Not Set Up',
          'Please set up your Hive account first in Settings.',
          [
            { text: 'Go to Settings', onPress: () => navigation.navigate('Settings') },
            { text: 'Cancel', onPress: () => navigation.goBack() }
          ]
        );
      }
    };

    checkWalletSetup();
  }, []);

  const onSuccess = async (e) => {
    if (!isScanning) return;

    setIsScanning(false);
    Vibration.vibrate();

    try {
      // Parse QR code data
      let scannedData;
      try {
        scannedData = JSON.parse(e.data);
      } catch (parseError) {
        // Handle simple text format or other formats
        throw new Error('Invalid QR code format');
      }

      // Validate QR code type
      if (scannedData.type !== 'hive_engine_payment' || scannedData.symbol !== 'PEAK') {
        throw new Error('This QR code is not for PeakeCoin payments');
      }

      // Validate payment data
      if (!scannedData.to || !scannedData.amount) {
        throw new Error('Invalid payment information in QR code');
      }

      // Check if user has enough balance
      const canSend = await WalletService.canSendAmount(parseFloat(scannedData.amount));
      if (!canSend) {
        throw new Error('Insufficient PeakeCoin balance');
      }

      // Convert amount to USD for display
      const usdAmount = await PriceService.convertPeakToFiat(
        parseFloat(scannedData.amount),
        'USD'
      );

      setPaymentData({
        ...scannedData,
        usdAmount: usdAmount
      });
      setShowConfirmation(true);

    } catch (error) {
      console.error('QR scan error:', error);
      Alert.alert('Error', error.message, [
        { text: 'Try Again', onPress: () => setIsScanning(true) }
      ]);
    }
  };

  const confirmPayment = async () => {
    if (!paymentData) return;

    setProcessing(true);

    try {
      const result = await WalletService.processQRPayment(paymentData);

      if (result.success) {
        showMessage({
          message: 'Payment Successful!',
          description: `Sent ${paymentData.amount} PEAK to ${paymentData.to}`,
          type: 'success',
          duration: 4000,
        });

        // Navigate to payment confirmation screen
        navigation.navigate('Payment', {
          type: 'success',
          result: result,
          amount: paymentData.amount,
          recipient: paymentData.to
        });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', error.message);
      setShowConfirmation(false);
      setIsScanning(true);
    } finally {
      setProcessing(false);
    }
  };

  const cancelPayment = () => {
    setShowConfirmation(false);
    setPaymentData(null);
    setIsScanning(true);
  };

  const formatCurrency = (amount, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
    }).format(amount);
  };

  if (showConfirmation && paymentData) {
    return (
      <View style={styles.container}>
        <View style={styles.confirmationContainer}>
          <Icon name="payment" size={64} color="#2196F3" style={styles.paymentIcon} />
          
          <Text style={styles.confirmTitle}>Confirm Payment</Text>
          
          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>
                {parseFloat(paymentData.amount).toFixed(4)} PEAK
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>USD Value:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(paymentData.usdAmount)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>To:</Text>
              <Text style={styles.detailValue}>@{paymentData.to}</Text>
            </View>
            
            {paymentData.memo && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Memo:</Text>
                <Text style={styles.detailValue}>{paymentData.memo}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelPayment}
              disabled={processing}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={confirmPayment}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Pay Now</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isScanning ? (
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={QRCodeScanner.Constants.FlashMode.off}
          showMarker={true}
          markerStyle={styles.marker}
          cameraStyle={styles.camera}
          topContent={
            <View style={styles.topContent}>
              <Text style={styles.centerText}>
                Scan a PeakeCoin payment QR code
              </Text>
              <Text style={styles.textBold}>
                Position the QR code within the frame
              </Text>
            </View>
          }
          bottomContent={
            <View style={styles.bottomContent}>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => navigation.goBack()}
              >
                <Icon name="close" size={24} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.processingText}>Processing QR code...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  marker: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  topContent: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  textBold: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  bottomContent: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  buttonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  confirmationContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  paymentIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  paymentDetails: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScannerScreen;
