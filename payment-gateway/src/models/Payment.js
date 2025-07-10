const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    merchantId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    peakeCoinAmount: {
        type: Number,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    description: String,
    callbackUrl: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed', 'expired'],
        default: 'pending'
    },
    transactionHash: String,
    confirmedAt: Date,
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
PaymentSchema.index({ merchantId: 1, createdAt: -1 });
PaymentSchema.index({ walletAddress: 1 });
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Payment', PaymentSchema);
