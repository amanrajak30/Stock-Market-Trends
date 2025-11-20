const cron = require('node-cron');
const { getPool } = require('../db');
const { fetchStockPrice } = require('../utils/marketApi');
const logger = require('../logger');

function startPriceUpdater(io) {
  // Update prices every minute
  cron.schedule('*/1 * * * *', async () => {
    try {
      const pool = getPool();
      const [stocks] = await pool.query('SELECT id, symbol FROM stocks');
      
      for (const stock of stocks) {
        try {
          const priceData = await fetchStockPrice(stock.symbol);
          
          await pool.query(
            'UPDATE stocks SET last_price = ?, change_percent = ?, volume = ? WHERE id = ?',
            [priceData.price, priceData.changePercent, priceData.volume, stock.id]
          );
          
          // Broadcast to market namespace
          if (io) {
            io.of('/market').to(`stock_${stock.symbol}`).emit('price_update', {
              symbol: stock.symbol,
              price: priceData.price,
              change: priceData.change,
              changePercent: priceData.changePercent
            });
          }
        } catch (error) {
          logger.error('Failed to update stock price', { symbol: stock.symbol, error: error.message });
        }
      }
      
      logger.info('Price update completed', { count: stocks.length });
    } catch (error) {
      logger.error('Price updater failed', { error: error.message });
    }
  });
  
  logger.info('Price updater cron job started');
}

module.exports = startPriceUpdater;
