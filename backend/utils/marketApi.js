const axios = require('axios');
const config = require('../config');
const logger = require('../logger');

const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

// Using Finnhub API (free tier: 60 requests/minute)
// Get your free API key at: https://finnhub.io/register
const FINNHUB_API_URL = 'https://finnhub.io/api/v1';

async function fetchStockPrice(symbol) {
  const cacheKey = `price_${symbol}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    // Check if API key is configured
    if (!config.market.apiKey || config.market.apiKey === '' || config.market.apiKey === 'undefined') {
      logger.warn('No API key configured, using mock data', { 
        symbol, 
        apiKey: config.market.apiKey ? 'exists but empty' : 'not set',
        apiKeyLength: config.market.apiKey ? config.market.apiKey.length : 0
      });
      return getMockPrice(symbol);
    }
    
    const apiKey = config.market.apiKey.trim();
    logger.info('Using Finnhub API', { 
      symbol, 
      apiKeyLength: apiKey.length,
      apiKeyPreview: apiKey.substring(0, 10) + '...'
    });

    // Fetch real stock data from Finnhub
    const url = `${FINNHUB_API_URL}/quote?symbol=${symbol}&token=${apiKey}`;
    logger.info('API Request URL', { url: url.replace(apiKey, 'HIDDEN') });
    
    const response = await axios.get(url, {
      timeout: 5000
    });

    const quote = response.data;
    
    // Check if we got valid data
    if (!quote.c || quote.c === 0) {
      logger.warn('Invalid data from API, using mock data', { symbol });
      return getMockPrice(symbol);
    }

    const priceData = {
      symbol,
      price: parseFloat(quote.c).toFixed(2), // Current price
      change: parseFloat(quote.d || 0).toFixed(2), // Change
      changePercent: parseFloat(quote.dp || 0).toFixed(2), // Change percent
      volume: quote.v || 0, // Volume
      high: parseFloat(quote.h || 0).toFixed(2), // High
      low: parseFloat(quote.l || 0).toFixed(2), // Low
      open: parseFloat(quote.o || 0).toFixed(2), // Open
      previousClose: parseFloat(quote.pc || 0).toFixed(2) // Previous close
    };
    
    cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
    logger.info('Fetched real stock price', { symbol, price: priceData.price });
    return priceData;
    
  } catch (error) {
    logger.error('Failed to fetch stock price from API, using mock data', { 
      symbol, 
      error: error.message 
    });
    return getMockPrice(symbol);
  }
}

// Fallback mock data generator
function getMockPrice(symbol) {
  const basePrice = {
    'AAPL': 175,
    'GOOGL': 140,
    'MSFT': 380,
    'AMZN': 145,
    'TSLA': 245,
    'META': 325,
    'NVDA': 495,
    'NFLX': 425,
    'AMD': 125,
    'INTC': 45
  };

  const base = basePrice[symbol] || 100;
  const variation = (Math.random() - 0.5) * 10;
  const price = (base + variation).toFixed(2);
  const change = (Math.random() * 10 - 5).toFixed(2);
  const changePercent = (Math.random() * 5 - 2.5).toFixed(2);

  return {
    symbol,
    price,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 100000000)
  };
}

async function fetchMultipleStocks(symbols) {
  return Promise.all(symbols.map(symbol => fetchStockPrice(symbol)));
}

module.exports = { fetchStockPrice, fetchMultipleStocks };
