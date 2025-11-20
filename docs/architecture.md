# Architecture

## System Overview

The trading platform consists of three main components:
- **Backend**: Express.js REST API with Socket.IO for real-time updates
- **Frontend**: Vanilla JavaScript SPA
- **Database**: MySQL for persistent storage

## Database Schema

### users
- id, email, password_hash, cash_balance, created_at, updated_at

### stocks
- id, symbol, name, last_price, change_percent, volume, market_cap, updated_at

### holdings
- id, user_id, stock_id, quantity, avg_price, created_at, updated_at

### transactions
- id, user_id, stock_id, type (BUY/SELL), quantity, price, total_amount, created_at

### orders
- id, user_id, stock_id, type, order_type (MARKET/LIMIT), quantity, limit_price, status, created_at, filled_at

### watchlist
- id, user_id, stock_id, created_at

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user

### Stocks
- GET /api/stocks - List all stocks
- GET /api/stocks/:symbol - Get stock details
- GET /api/stocks/:symbol/history - Get historical data

### Trading
- POST /api/trade/buy - Execute buy order
- POST /api/trade/sell - Execute sell order
- GET /api/trade/portfolio - Get user portfolio

### Transactions
- GET /api/transactions - Get transaction history

### Watchlist
- GET /api/watchlist - Get watchlist
- POST /api/watchlist - Add to watchlist
- DELETE /api/watchlist/:id - Remove from watchlist

## WebSocket Events

### Market Namespace (/market)
- price_update: Real-time stock price updates

### Private Namespace (/)
- portfolio_update: User portfolio changes after trades

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation with express-validator
- SQL injection prevention with parameterized queries
