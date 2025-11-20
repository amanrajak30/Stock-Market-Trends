const { body, validationResult } = require('express-validator');

const tradeValidation = [
  body('symbol').isString().trim().notEmpty().withMessage('Symbol is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('type').isIn(['BUY', 'SELL']).withMessage('Type must be BUY or SELL')
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { tradeValidation, validate };
