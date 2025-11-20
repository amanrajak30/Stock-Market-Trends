const express = require('express');
const { getPool } = require('../db');
const authMiddleware = require('../middleware/auth');
const logger = require('../logger');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const pool = getPool();
    const [watchlist] = await pool.query(
      `SELECT w.id, s.* 
       FROM watchlist w 
       JOIN stocks s ON w.stock_id = s.id 
       WHERE w.user_id = ?`,
      [userId]
    );
    
    res.json({ watchlist });
  } catch (error) {
    logger.error('Failed to fetch watchlist', { userId, error: error.message });
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { symbol } = req.body;
  
  try {
    const pool = getPool();
    
    const [stocks] = await pool.query('SELECT id FROM stocks WHERE symbol = ?', [symbol.toUpperCase()]);
    
    if (stocks.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    await pool.query(
      'INSERT IGNORE INTO watchlist (user_id, stock_id) VALUES (?, ?)',
      [userId, stocks[0].id]
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
    const pool = getPool();
    await pool.query('DELETE FROM watchlist WHERE id = ? AND user_id = ?', [id, userId]);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to remove from watchlist', { userId, id, error: error.message });
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;
