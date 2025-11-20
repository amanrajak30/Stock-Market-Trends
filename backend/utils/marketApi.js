const axios = require('axios');
const config = require('../config');
const logger = require('../logger');

const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

async function fetchStockPrice(symbol) {
  const cacheKey = `price_${symbol}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    // Mock API call - replace with real API
    // const response = await axios.get(`${config.market.apiUrl}/quote/${symbol}`, {
    //   headers: { 'Authorization': `Bearer ${config.market.apiKey}` }
    // });
    
    // Mock data for development
    const mockPrice = {
      symbol,
      price: (Math.random() * 500 + 50).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: (Math.random() * 5 - 2.5).toFixed(2),
      volume: Math.floor(Math.random() * 100000000)
    };
    
    cache.set(cacheKey, { data: mockPrice, timestamp: Date.now() });
    return mockPrice;
  } catch (error) {
    logger.error('Failed to fetch stock price', { symbol, error: error.message });
    throw error;
  }
}

async function fetchMultipleStocks(symbols) {
  return Promise.all(symbols.map(symbol => fetchStockPrice(symbol)));
}

module.exports = { fetchStockPrice, fetchMultipleStocks };
