const express = require('express');
const { getPool } = require('../db');
const authMiddleware = require('../middleware/auth');
const logger = require('../logger');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const pool = getPool();
    const [transactions] = await pool.query(
      `SELECT t.*, s.symbol, s.name 
       FROM transactions t 
       JOIN stocks s ON t.stock_id = s.id 
       WHERE t.user_id = ? 
       ORDER BY t.created_at DESC 
       LIMIT 100`,
      [userId]
    );
    
    res.json({ transactions });
  } catch (error) {
    logger.error('Failed to fetch transactions', { userId, error: error.message });
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
