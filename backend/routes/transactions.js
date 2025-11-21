const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');
const logger = require('../logger');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const transactions = await Transaction.find({ user_id: userId })
      .populate('stock_id')
      .sort({ createdAt: -1 })
      .limit(100);
    
    const formattedTransactions = transactions.map(t => ({
      id: t._id,
      type: t.type,
      quantity: t.quantity,
      price: t.price,
      total_amount: t.total_amount,
      created_at: t.createdAt,
      symbol: t.stock_id.symbol,
      name: t.stock_id.name
    }));
    
    res.json({ transactions: formattedTransactions });
  } catch (error) {
    logger.error('Failed to fetch transactions', { userId, error: error.message });
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
