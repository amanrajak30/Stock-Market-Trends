const express = require('express');
const { executeTrade, getPortfolio } = require('../controllers/tradeController');
const authMiddleware = require('../middleware/auth');
const { tradeValidation, validate } = require('../validators/tradeValidator');

const router = express.Router();

router.post('/buy', authMiddleware, tradeValidation, validate, (req, res) => {
  req.body.type = 'BUY';
  executeTrade(req, res);
});

router.post('/sell', authMiddleware, tradeValidation, validate, (req, res) => {
  req.body.type = 'SELL';
  executeTrade(req, res);
});

router.get('/portfolio', authMiddleware, getPortfolio);

module.exports = router;
