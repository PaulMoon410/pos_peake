const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const PeakeCoinService = require('../services/PeakeCoinService');
const PriceService = require('../services/PriceService');

const router = express.Router();

// Create a new payment request
router.post('/create', async (req, res) => {
    try {
        const { amount, currency = 'USD', merchantId, description, callbackUrl } = req.body;

        if (!amount || !merchantId) {
            return res.status(400).json({ error: 'Amount and merchantId are required' });
        }

        // Convert fiat amount to PeakeCoin
        const peakeCoinPrice = await PriceService.getPeakeCoinPrice(currency);
        const peakeCoinAmount = amount / peakeCoinPrice;

        // Generate unique payment ID and wallet address
        const paymentId = uuidv4();
        const walletAddress = await PeakeCoinService.generatePaymentAddress();

        // Create payment record
        const payment = new Payment({
            paymentId,
            merchantId,
            amount,
            currency,
            peakeCoinAmount,
            walletAddress,
            description,
            callbackUrl,
            status: 'pending',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        await payment.save();

        // Generate QR code for payment
        const paymentData = {
            address: walletAddress,
            amount: peakeCoinAmount,
            paymentId,
            currency: 'PEAK'
        };

        const qrCode = await QRCode.toDataURL(JSON.stringify(paymentData));

        res.json({
            paymentId,
            walletAddress,
            amount: peakeCoinAmount,
            currency: 'PEAK',
            fiatAmount: amount,
            fiatCurrency: currency,
            qrCode,
            expiresAt: payment.expiresAt
        });

    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Check payment status
router.get('/status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findOne({ paymentId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Check if payment has expired
        if (payment.status === 'pending' && new Date() > payment.expiresAt) {
            payment.status = 'expired';
            await payment.save();
        }

        res.json({
            paymentId: payment.paymentId,
            status: payment.status,
            amount: payment.peakeCoinAmount,
            currency: 'PEAK',
            fiatAmount: payment.amount,
            fiatCurrency: payment.currency,
            transactionHash: payment.transactionHash,
            confirmedAt: payment.confirmedAt
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

// Webhook endpoint for payment confirmations
router.post('/webhook', async (req, res) => {
    try {
        const { transactionHash, walletAddress, amount } = req.body;

        // Verify transaction on blockchain
        const isValid = await PeakeCoinService.verifyTransaction(transactionHash, walletAddress, amount);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid transaction' });
        }

        // Find and update payment
        const payment = await Payment.findOne({ walletAddress, status: 'pending' });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        payment.status = 'confirmed';
        payment.transactionHash = transactionHash;
        payment.confirmedAt = new Date();
        await payment.save();

        // Notify merchant via callback URL
        if (payment.callbackUrl) {
            try {
                await require('axios').post(payment.callbackUrl, {
                    paymentId: payment.paymentId,
                    status: 'confirmed',
                    transactionHash,
                    amount: payment.peakeCoinAmount
                });
            } catch (callbackError) {
                console.error('Callback notification failed:', callbackError);
            }
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Get payment history for a merchant
router.get('/history/:merchantId', async (req, res) => {
    try {
        const { merchantId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        const query = { merchantId };
        if (status) query.status = status;

        const payments = await Payment.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Payment.countDocuments(query);

        res.json({
            payments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error('History retrieval error:', error);
        res.status(500).json({ error: 'Failed to retrieve payment history' });
    }
});

module.exports = router;
