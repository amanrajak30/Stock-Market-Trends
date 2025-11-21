const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  cash_balance: {
    type: Number,
    default: 10000.00
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
