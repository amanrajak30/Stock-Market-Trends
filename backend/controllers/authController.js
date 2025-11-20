const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool } = require('../db');
const config = require('../config');
const logger = require('../logger');

async function signup(req, res) {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const pool = getPool();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    
    const token = jwt.sign(
      { userId: result.insertId, email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    logger.info('User registered', { userId: result.insertId, email });
    
    res.status(201).json({
      token,
      user: { id: result.insertId, email, cashBalance: 10000.00 }
    });
  } catch (error) {
    logger.error('Signup failed', { error: error.message });
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const pool = getPool();
    const [users] = await pool.query(
      'SELECT id, email, password_hash, cash_balance FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    logger.info('User logged in', { userId: user.id, email: user.email });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        cashBalance: parseFloat(user.cash_balance)
      }
    });
  } catch (error) {
    logger.error('Login failed', { error: error.message });
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = { signup, login };
