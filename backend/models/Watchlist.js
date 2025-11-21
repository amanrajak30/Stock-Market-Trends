const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  }
}, {
  timestamps: true
});

watchlistSchema.index({ user_id: 1, stock_id: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
