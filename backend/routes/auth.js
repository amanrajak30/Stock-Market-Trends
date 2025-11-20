const express = require('express');
const { signup, login } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

module.exports = router;
