const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');
const logger = require('../logger');

async function executeTrade(req, res) {
  const { symbol, quantity, type } = req.body;
  const userId = req.user.userId;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() }).session(session);
    
    if (!stock) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    const price = stock.last_price;
    const totalAmount = price * quantity;
    
    const user = await User.findById(userId).session(session);
    
    if (type === 'BUY') {
      if (user.cash_balance < totalAmount) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      
      user.cash_balance -= totalAmount;
      await user.save({ session });
      
      const holding = await Holding.findOne({ 
        user_id: userId, 
        stock_id: stock._id 
      }).session(session);
      
      if (holding) {
        const newQuantity = holding.quantity + quantity;
        holding.avg_price = ((holding.avg_price * holding.quantity) + totalAmount) / newQuantity;
        holding.quantity = newQuantity;
        await holding.save({ session });
      } else {
        await Holding.create([{
          user_id: userId,
          stock_id: stock._id,
          quantity,
          avg_price: price
        }], { session });
      }
    } else if (type === 'SELL') {
      const holding = await Holding.findOne({ 
        user_id: userId, 
        stock_id: stock._id 
      }).session(session);
      
      if (!holding || holding.quantity < quantity) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'Insufficient holdings' });
      }
      
      user.cash_balance += totalAmount;
      await user.save({ session });
      
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        await Holding.deleteOne({ _id: holding._id }).session(session);
      } else {
        await holding.save({ session });
      }
    }
    
    await Transaction.create([{
      user_id: userId,
      stock_id: stock._id,
      type,
      quantity,
      price,
      total_amount: totalAmount
    }], { session });
    
    await session.commitTransaction();
    
    logger.info('Trade executed', { userId, symbol, type, quantity, price });
    
    res.json({
      success: true,
      transaction: {
        symbol,
        type,
        quantity,
        price,
        totalAmount,
        cashBalance: user.cash_balance
      }
    });
    
    if (req.app.get('io')) {
      req.app.get('io').to(`user_${userId}`).emit('portfolio_update', {
        cashBalance: user.cash_balance
      });
    }
  } catch (error) {
    await session.abortTransaction();
    logger.error('Trade execution failed', { userId, symbol, type, error: error.message });
    res.status(500).json({ error: 'Trade execution failed' });
  } finally {
    session.endSession();
  }
}

async function getPortfolio(req, res) {
  const userId = req.user.userId;
  
  try {
    const user = await User.findById(userId);
    
    const holdings = await Holding.find({ user_id: userId })
      .populate('stock_id');
    
    const portfolio = holdings.map(h => ({
      symbol: h.stock_id.symbol,
      name: h.stock_id.name,
      quantity: h.quantity,
      avgPrice: h.avg_price,
      currentPrice: h.stock_id.last_price,
      totalValue: h.quantity * h.stock_id.last_price,
      profitLoss: (h.stock_id.last_price - h.avg_price) * h.quantity
    }));
    
    const totalValue = portfolio.reduce((sum, p) => sum + p.totalValue, 0);
    
    res.json({
      cashBalance: user.cash_balance,
      holdings: portfolio,
      totalValue,
      totalPortfolioValue: user.cash_balance + totalValue
    });
  } catch (error) {
    logger.error('Failed to get portfolio', { userId, error: error.message });
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}

module.exports = { executeTrade, getPortfolio };
