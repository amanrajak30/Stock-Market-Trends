const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config');
const logger = require('./logger');

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: config.server.corsOrigin,
      methods: ['GET', 'POST']
    }
  });
  
  // Market namespace for public price updates
  const marketNs = io.of('/market');
  
  marketNs.on('connection', (socket) => {
    logger.info('Client connected to market feed', { socketId: socket.id });
    
    socket.on('subscribe', (symbols) => {
      logger.info('Client subscribed to symbols', { socketId: socket.id, symbols });
      symbols.forEach(symbol => socket.join(`stock_${symbol}`));
    });
    
    socket.on('disconnect', () => {
      logger.info('Client disconnected from market feed', { socketId: socket.id });
    });
  });
  
  // Private namespace for authenticated users
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    logger.info('User connected', { userId: socket.userId, socketId: socket.id });
    
    socket.join(`user_${socket.userId}`);
    
    socket.on('disconnect', () => {
      logger.info('User disconnected', { userId: socket.userId, socketId: socket.id });
    });
  });
  
  return io;
}

module.exports = initSocket;
