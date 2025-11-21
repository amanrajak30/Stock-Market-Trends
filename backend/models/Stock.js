const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  last_price: {
    type: Number,
    default: 0
  },
  change_percent: {
    type: Number,
    default: 0
  },
  volume: {
    type: Number,
    default: 0
  },
  market_cap: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stock', stockSchema);
