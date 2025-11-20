const express = require('express');
const { listStocks, getStockDetail, getStockHistory } = require('../controllers/stocksController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, listStocks);
router.get('/:symbol', authMiddleware, getStockDetail);
router.get('/:symbol/history', authMiddleware, getStockHistory);

module.exports = router;
