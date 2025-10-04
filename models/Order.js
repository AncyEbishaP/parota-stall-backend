const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: {
    type: Map,
    of: Number,
    required: true
  },
  orderType: {
    type: String,
    enum: ['Dine-in', 'Take-away'],
    required: true
  },
  paymentType: {
    type: String,
    enum: ['Cash', 'UPI'],
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'delivered'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: {
    type: Date
  }
});

module.exports = mongoose.model('Order', OrderSchema);