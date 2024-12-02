const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  stripePaymentId: String,
  status: {
    type: String,
    enum: ['completed', 'refunded', 'failed'],
    default: 'completed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);