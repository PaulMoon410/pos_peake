import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Alert,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import { 
  QrCodeScanner, 
  CameraAlt, 
  Upload,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Mock QR scan results for demo
  const mockQRResults = [
    'peakecoin:pay?to=neo-pizza-downtown&amount=15.99&memo=Pizza%20Order%20%23123',
    'peakecoin:v4v?creator=awesome-podcaster&content=episode-42&boost=true',
    'peakecoin:merchant?store=crypto-cafe-midtown&register=pos-001',
    'https://v4v.peakecoin.app/pay/creator/crypto-musician',
  ];

  const parseQRCode = (qrData) => {
    try {
      if (qrData.startsWith('peakecoin:pay?')) {
        const url = new URL(qrData);
        return {
          type: 'payment',
          to: url.searchParams.get('to'),
          amount: url.searchParams.get('amount'),
          memo: decodeURIComponent(url.searchParams.get('memo') || ''),
        };
      } else if (qrData.startsWith('peakecoin:v4v?')) {
        const url = new URL(qrData);
        return {
          type: 'v4v',
          creator: url.searchParams.get('creator'),
          content: url.searchParams.get('content'),
          boost: url.searchParams.get('boost') === 'true',
        };
      } else if (qrData.startsWith('peakecoin:merchant?')) {
        const url = new URL(qrData);
        return {
          type: 'merchant',
          store: url.searchParams.get('store'),
          register: url.searchParams.get('register'),
        };
      } else if (qrData.startsWith('https://')) {
        return {
          type: 'url',
          url: qrData,
        };
      }
    } catch (err) {
      console.error('QR parsing error:', err);
    }
    return { type: 'unknown', data: qrData };
  };

  const handleScanResult = (result) => {
    setScanResult(result);
    const parsed = parseQRCode(result);
    
    switch (parsed.type) {
      case 'payment':
        toast.success(`Payment request from ${parsed.to} for ${parsed.amount} PEAK`);
        break;
      case 'v4v':
        toast.success(`V4V payment to ${parsed.creator}`);
        break;
      case 'merchant':
        toast.success(`Merchant payment at ${parsed.store}`);
        break;
      case 'url':
        toast.success('Web link detected');
        break;
      default:
        toast.error('Unknown QR code format');
    }
  };

  const startMockScan = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate scanning delay
    setTimeout(() => {
      const randomResult = mockQRResults[Math.floor(Math.random() * mockQRResults.length)];
      handleScanResult(randomResult);
      setIsScanning(false);
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd use a QR code library to decode the image
      toast.success('QR code image uploaded (demo mode)');
      const randomResult = mockQRResults[Math.floor(Math.random() * mockQRResults.length)];
      handleScanResult(randomResult);
    }
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      handleScanResult(manualInput.trim());
      setManualInput('');
    }
  };

  const parsedResult = scanResult ? parseQRCode(scanResult) : null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
        📱 QR Code Scanner
      </Typography>
      
      <Grid container spacing={3}>
        {/* Scanner Interface */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scan QR Code
                </Typography>
                
                {/* Mock Camera View */}
                <Paper 
                  sx={{ 
                    height: 250, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    mb: 2,
                    position: 'relative'
                  }}
                >
                  {isScanning ? (
                    <Box textAlign="center">
                      <QrCodeScanner sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                      <Typography>Scanning...</Typography>
                      <Box sx={{ width: '80%', mt: 2 }}>
                        <motion.div
                          animate={{ scaleX: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Box
                            sx={{
                              height: 2,
                              backgroundColor: 'primary.main',
                              borderRadius: 1,
                            }}
                          />
                        </motion.div>
                      </Box>
                    </Box>
                  ) : (
                    <Box textAlign="center">
                      <CameraAlt sx={{ fontSize: 60, color: 'grey.400', mb: 1 }} />
                      <Typography color="textSecondary">
                        Camera Preview
                      </Typography>
                    </Box>
                  )}
                </Paper>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<QrCodeScanner />}
                    onClick={startMockScan}
                    disabled={isScanning}
                    fullWidth
                  >
                    {isScanning ? 'Scanning...' : 'Start Scan'}
                  </Button>
                  
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    <Upload />
                  </IconButton>
                </Box>

                {/* Manual Input */}
                <TextField
                  fullWidth
                  label="Or enter QR code manually"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={handleManualInput}
                        disabled={!manualInput.trim()}
                        size="small"
                      >
                        Process
                      </Button>
                    ),
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Scan Results */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scan Results
                </Typography>

                {!scanResult ? (
                  <Box textAlign="center" py={4}>
                    <QrCodeScanner sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                    <Typography color="textSecondary">
                      No QR code scanned yet
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      QR Code detected successfully!
                    </Alert>

                    {parsedResult && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Type: {parsedResult.type.toUpperCase()}
                        </Typography>

                        {parsedResult.type === 'payment' && (
                          <Box>
                            <Typography><strong>To:</strong> {parsedResult.to}</Typography>
                            <Typography><strong>Amount:</strong> {parsedResult.amount} PEAK</Typography>
                            <Typography><strong>Memo:</strong> {parsedResult.memo}</Typography>
                            <Button 
                              variant="contained" 
                              sx={{ mt: 2 }}
                              onClick={() => toast.success('Payment initiated!')}
                            >
                              Send Payment
                            </Button>
                          </Box>
                        )}

                        {parsedResult.type === 'v4v' && (
                          <Box>
                            <Typography><strong>Creator:</strong> {parsedResult.creator}</Typography>
                            <Typography><strong>Content:</strong> {parsedResult.content}</Typography>
                            <Typography><strong>Boost:</strong> {parsedResult.boost ? 'Yes' : 'No'}</Typography>
                            <Button 
                              variant="contained" 
                              sx={{ mt: 2 }}
                              onClick={() => toast.success('V4V payment sent!')}
                            >
                              Send V4V Payment
                            </Button>
                          </Box>
                        )}

                        {parsedResult.type === 'merchant' && (
                          <Box>
                            <Typography><strong>Store:</strong> {parsedResult.store}</Typography>
                            <Typography><strong>Register:</strong> {parsedResult.register}</Typography>
                            <Button 
                              variant="contained" 
                              sx={{ mt: 2 }}
                              onClick={() => toast.success('Merchant payment processed!')}
                            >
                              Pay Merchant
                            </Button>
                          </Box>
                        )}

                        <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="caption" component="pre" sx={{ wordBreak: 'break-all' }}>
                            {scanResult}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Test QR Codes
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Click to simulate scanning these QR codes:
                </Typography>
                
                <Grid container spacing={1}>
                  {mockQRResults.map((qr, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleScanResult(qr)}
                        sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                      >
                        <Box>
                          <Typography variant="caption" display="block">
                            {qr.includes('pay?') ? '💳 Payment' : 
                             qr.includes('v4v?') ? '🎵 V4V' :
                             qr.includes('merchant?') ? '🏪 Merchant' : '🌐 Web Link'}
                          </Typography>
                          <Typography variant="body2" noWrap>
                            {qr.length > 40 ? qr.substring(0, 40) + '...' : qr}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRScanner;
