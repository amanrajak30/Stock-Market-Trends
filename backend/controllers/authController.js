const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const logger = require('../logger');

async function signup(req, res) {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existing = await User.findOne({ email });
    
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      password_hash
    });
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    logger.info('User registered', { userId: user._id, email });
    
    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        cashBalance: user.cash_balance 
      }
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
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    logger.info('User logged in', { userId: user._id, email: user.email });
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        cashBalance: user.cash_balance
      }
    });
  } catch (error) {
    logger.error('Login failed', { error: error.message });
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = { signup, login };
