const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    enum: ['project-payment', 'writer-payment', 'referral-payment', 'refund', 'commission', 'marketing', 'software', 'office', 'other'],
    required: [true, 'Category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentMethod: {
    type: String,
    enum: ['bank-transfer', 'paypal', 'stripe', 'cash', 'check', 'other'],
    default: 'bank-transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  paidDate: Date,
  reference: {
    type: String,
    trim: true
  },
  notes: String,
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Replaces manual hooks
});

// Index for better query performance
financialSchema.index({ type: 1, status: 1 });
financialSchema.index({ project: 1 });
financialSchema.index({ user: 1 });
financialSchema.index({ transactionDate: -1 });

// Virtual for formatted amount
financialSchema.virtual('formattedAmount').get(function() {
  const currencySymbol = this.currency === 'NGN' ? '₦' : this.currency;
  return `${currencySymbol}${this.amount.toLocaleString()}`;
});

// Ensure virtual fields are serialized
financialSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Financial', financialSchema);
