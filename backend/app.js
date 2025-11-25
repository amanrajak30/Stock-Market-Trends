const express = require('express');
const http = require('http');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
const { initDB } = require('./db');
const initSocket = require('./socket');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const startPriceUpdater = require('./cron/cacheUpdater');

const authRoutes = require('./routes/auth');
const stocksRoutes = require('./routes/stocks');
const tradeRoutes = require('./routes/trade');
const transactionsRoutes = require('./routes/transactions');
const watchlistRoutes = require('./routes/watchlist');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ 
  origin: config.server.corsOrigin === '*' ? '*' : config.server.corsOrigin,
  credentials: true 
}));
app.use(express.json());
app.use(express.static('../frontend'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', apiLimiter, stocksRoutes);
app.use('/api/trade', apiLimiter, tradeRoutes);
app.use('/api/transactions', apiLimiter, transactionsRoutes);
app.use('/api/watchlist', apiLimiter, watchlistRoutes);

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile('index.html', { root: '../frontend' });
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Error handler
app.use(errorHandler);

// Initialize
async function start() {
  try {
    await initDB();
    
    const io = initSocket(server);
    app.set('io', io);
    
    startPriceUpdater(io);
    
    server.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

start();
