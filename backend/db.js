const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

async function initDB() {
  try {
    await mongoose.connect(config.db.uri);
    
    logger.info('MongoDB connected successfully');
    
    // Seed initial stocks if database is empty
    const Stock = require('./models/Stock');
    const count = await Stock.countDocuments();
    
    if (count === 0) {
      await Stock.insertMany([
        { symbol: 'AAPL', name: 'Apple Inc.', last_price: 175.50, change_percent: 1.25, volume: 50000000, market_cap: 2800000000000 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', last_price: 140.25, change_percent: -0.50, volume: 25000000, market_cap: 1750000000000 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', last_price: 380.75, change_percent: 2.10, volume: 30000000, market_cap: 2850000000000 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', last_price: 145.80, change_percent: 0.75, volume: 40000000, market_cap: 1500000000000 },
        { symbol: 'TSLA', name: 'Tesla Inc.', last_price: 245.30, change_percent: -1.80, volume: 100000000, market_cap: 780000000000 },
        { symbol: 'META', name: 'Meta Platforms Inc.', last_price: 325.60, change_percent: 1.85, volume: 35000000, market_cap: 850000000000 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', last_price: 495.20, change_percent: 3.45, volume: 45000000, market_cap: 1200000000000 },
        { symbol: 'NFLX', name: 'Netflix Inc.', last_price: 425.75, change_percent: -0.85, volume: 20000000, market_cap: 185000000000 },
        { symbol: 'AMD', name: 'Advanced Micro Devices', last_price: 125.40, change_percent: 2.15, volume: 55000000, market_cap: 200000000000 },
        { symbol: 'INTC', name: 'Intel Corporation', last_price: 45.80, change_percent: -1.25, volume: 60000000, market_cap: 190000000000 },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.', last_price: 65.30, change_percent: 0.95, volume: 28000000, market_cap: 75000000000 },
        { symbol: 'DIS', name: 'The Walt Disney Company', last_price: 95.20, change_percent: 1.35, volume: 32000000, market_cap: 175000000000 },
        { symbol: 'UBER', name: 'Uber Technologies Inc.', last_price: 58.75, change_percent: 2.45, volume: 38000000, market_cap: 115000000000 },
        { symbol: 'SPOT', name: 'Spotify Technology', last_price: 185.90, change_percent: -0.65, volume: 15000000, market_cap: 35000000000 },
        { symbol: 'SQ', name: 'Block Inc.', last_price: 72.40, change_percent: 1.75, volume: 22000000, market_cap: 42000000000 },
        { symbol: 'COIN', name: 'Coinbase Global Inc.', last_price: 125.80, change_percent: 4.25, volume: 18000000, market_cap: 30000000000 },
        { symbol: 'SHOP', name: 'Shopify Inc.', last_price: 68.50, change_percent: 1.95, volume: 25000000, market_cap: 85000000000 },
        { symbol: 'SNAP', name: 'Snap Inc.', last_price: 12.35, change_percent: -2.15, volume: 42000000, market_cap: 19000000000 },
        { symbol: 'TWTR', name: 'Twitter Inc.', last_price: 45.60, change_percent: 0.85, volume: 35000000, market_cap: 35000000000 },
        { symbol: 'BA', name: 'Boeing Company', last_price: 215.40, change_percent: -1.45, volume: 28000000, market_cap: 135000000000 }
      ]);
      logger.info('Sample stocks inserted');
    }
    
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    throw error;
  }
}

function getDB() {
  if (!mongoose.connection.readyState) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return mongoose.connection;
}

module.exports = { initDB, getDB };
