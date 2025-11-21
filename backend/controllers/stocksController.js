const Stock = require('../models/Stock');
const logger = require('../logger');

async function listStocks(req, res) {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    res.json({ stocks });
  } catch (error) {
    logger.error('Failed to list stocks', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
}

async function getStockDetail(req, res) {
  const { symbol } = req.params;
  
  try {
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json({ stock });
  } catch (error) {
    logger.error('Failed to get stock detail', { symbol, error: error.message });
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
}

async function getStockHistory(req, res) {
  const { symbol } = req.params;
  
  try {
    // Mock historical data - replace with real data source
    const history = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      open: (Math.random() * 500 + 50).toFixed(2),
      high: (Math.random() * 500 + 50).toFixed(2),
      low: (Math.random() * 500 + 50).toFixed(2),
      close: (Math.random() * 500 + 50).toFixed(2),
      volume: Math.floor(Math.random() * 100000000)
    })).reverse();
    
    res.json({ symbol, history });
  } catch (error) {
    logger.error('Failed to get stock history', { symbol, error: error.message });
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
}

module.exports = { listStocks, getStockDetail, getStockHistory };
