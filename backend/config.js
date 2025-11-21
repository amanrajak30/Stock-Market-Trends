require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'trading_platform'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  market: {
    apiKey: process.env.MARKET_API_KEY,
    apiUrl: process.env.MARKET_API_URL
  },
  server: {
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
};
