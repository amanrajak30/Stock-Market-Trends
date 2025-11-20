const { getPool } = require('../db');
const { fetchStockPrice } = require('../utils/marketApi');
const logger = require('../logger');

async function executeTrade(req, res) {
  const { symbol, quantity, type } = req.body;
  const userId = req.user.userId;
  
  const connection = await getPool().getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [stocks] = await connection.query(
      'SELECT id, last_price FROM stocks WHERE symbol = ? FOR UPDATE',
      [symbol.toUpperCase()]
    );
    
    if (stocks.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    const stock = stocks[0];
    const price = parseFloat(stock.last_price);
    const totalAmount = price * quantity;
    
    const [users] = await connection.query(
      'SELECT cash_balance FROM users WHERE id = ? FOR UPDATE',
      [userId]
    );
    
    const cashBalance = parseFloat(users[0].cash_balance);
    
    if (type === 'BUY') {
      if (cashBalance < totalAmount) {
        await connection.rollback();
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      
      await connection.query(
        'UPDATE users SET cash_balance = cash_balance - ? WHERE id = ?',
        [totalAmount, userId]
      );
      
      const [holdings] = await connection.query(
        'SELECT id, quantity, avg_price FROM holdings WHERE user_id = ? AND stock_id = ?',
        [userId, stock.id]
      );
      
      if (holdings.length > 0) {
        const holding = holdings[0];
        const newQuantity = holding.quantity + quantity;
        const newAvgPrice = ((holding.avg_price * holding.quantity) + totalAmount) / newQuantity;
        
        await connection.query(
          'UPDATE holdings SET quantity = ?, avg_price = ? WHERE id = ?',
          [newQuantity, newAvgPrice, holding.id]
        );
      } else {
        await connection.query(
          'INSERT INTO holdings (user_id, stock_id, quantity, avg_price) VALUES (?, ?, ?, ?)',
          [userId, stock.id, quantity, price]
        );
      }
    } else if (type === 'SELL') {
      const [holdings] = await connection.query(
        'SELECT id, quantity FROM holdings WHERE user_id = ? AND stock_id = ?',
        [userId, stock.id]
      );
      
      if (holdings.length === 0 || holdings[0].quantity < quantity) {
        await connection.rollback();
        return res.status(400).json({ error: 'Insufficient holdings' });
      }
      
      await connection.query(
        'UPDATE users SET cash_balance = cash_balance + ? WHERE id = ?',
        [totalAmount, userId]
      );
      
      const newQuantity = holdings[0].quantity - quantity;
      if (newQuantity === 0) {
        await connection.query('DELETE FROM holdings WHERE id = ?', [holdings[0].id]);
      } else {
        await connection.query(
          'UPDATE holdings SET quantity = ? WHERE id = ?',
          [newQuantity, holdings[0].id]
        );
      }
    }
    
    await connection.query(
      'INSERT INTO transactions (user_id, stock_id, type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, stock.id, type, quantity, price, totalAmount]
    );
    
    await connection.commit();
    
    logger.info('Trade executed', { userId, symbol, type, quantity, price });
    
    const [updatedUser] = await connection.query(
      'SELECT cash_balance FROM users WHERE id = ?',
      [userId]
    );
    
    res.json({
      success: true,
      transaction: {
        symbol,
        type,
        quantity,
        price,
        totalAmount,
        cashBalance: parseFloat(updatedUser[0].cash_balance)
      }
    });
    
    // Emit portfolio update via socket (handled in socket.js)
    if (req.app.get('io')) {
      req.app.get('io').to(`user_${userId}`).emit('portfolio_update', {
        cashBalance: parseFloat(updatedUser[0].cash_balance)
      });
    }
  } catch (error) {
    await connection.rollback();
    logger.error('Trade execution failed', { userId, symbol, type, error: error.message });
    res.status(500).json({ error: 'Trade execution failed' });
  } finally {
    connection.release();
  }
}

async function getPortfolio(req, res) {
  const userId = req.user.userId;
  
  try {
    const pool = getPool();
    
    const [user] = await pool.query(
      'SELECT cash_balance FROM users WHERE id = ?',
      [userId]
    );
    
    const [holdings] = await pool.query(
      `SELECT h.*, s.symbol, s.name, s.last_price 
       FROM holdings h 
       JOIN stocks s ON h.stock_id = s.id 
       WHERE h.user_id = ?`,
      [userId]
    );
    
    const portfolio = holdings.map(h => ({
      symbol: h.symbol,
      name: h.name,
      quantity: h.quantity,
      avgPrice: parseFloat(h.avg_price),
      currentPrice: parseFloat(h.last_price),
      totalValue: h.quantity * parseFloat(h.last_price),
      profitLoss: (parseFloat(h.last_price) - parseFloat(h.avg_price)) * h.quantity
    }));
    
    const totalValue = portfolio.reduce((sum, p) => sum + p.totalValue, 0);
    
    res.json({
      cashBalance: parseFloat(user[0].cash_balance),
      holdings: portfolio,
      totalValue,
      totalPortfolioValue: parseFloat(user[0].cash_balance) + totalValue
    });
  } catch (error) {
    logger.error('Failed to get portfolio', { userId, error: error.message });
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}

module.exports = { executeTrade, getPortfolio };
