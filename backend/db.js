const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

async function initDB() {
  try {
    await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
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
        { symbol: 'TSLA', name: 'Tesla Inc.', last_price: 245.30, change_percent: -1.80, volume: 100000000, market_cap: 780000000000 }
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
