const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Debug: Log if API key is loaded
console.log('Environment loaded:', {
  hasApiKey: !!process.env.MARKET_API_KEY,
  apiKeyLength: process.env.MARKET_API_KEY ? process.env.MARKET_API_KEY.length : 0
});

module.exports = {
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/trading_platform'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  market: {
    apiKey: process.env.MARKET_API_KEY || '',
    apiUrl: process.env.MARKET_API_URL || 'https://finnhub.io/api/v1'
  },
  server: {
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
};
