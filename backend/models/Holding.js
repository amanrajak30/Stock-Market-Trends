const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  avg_price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

holdingSchema.index({ user_id: 1, stock_id: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);
