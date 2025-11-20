const mysql = require('mysql2/promise');
const config = require('./config');
const logger = require('./logger');

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    const connection = await pool.getConnection();
    logger.info('Database connected successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    throw error;
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return pool;
}

module.exports = { initDB, getPool };
