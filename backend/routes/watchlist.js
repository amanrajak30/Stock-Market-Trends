const express = require('express');
const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');
const authMiddleware = require('../middleware/auth');
const logger = require('../logger');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const watchlist = await Watchlist.find({ user_id: userId })
      .populate('stock_id');
    
    const formattedWatchlist = watchlist.map(item => ({
      id: item._id,
      ...item.stock_id.toObject()
    }));
    
    res.json({ watchlist: formattedWatchlist });
  } catch (error) {
    logger.error('Failed to fetch watchlist', { userId, error: error.message });
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { symbol } = req.body;
  
  try {
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    await Watchlist.findOneAndUpdate(
      { user_id: userId, stock_id: stock._id },
      { user_id: userId, stock_id: stock._id },
      { upsert: true, new: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to add to watchlist', { userId, symbol, error: error.message });
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  
  try {
    await Watchlist.deleteOne({ _id: id, user_id: userId });
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to remove from watchlist', { userId, id, error: error.message });
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;
