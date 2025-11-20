# Stock Trading Platform

A real-time stock trading platform with market data feeds, portfolio management, and live order execution.

## Setup

1. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Initialize database:
```bash
mysql -u root -p < db/schema.sql
```

4. Start backend:
```bash
cd backend && npm start
```

5. Start frontend:
```bash
cd frontend && npm start
```

## Architecture

- **Backend**: Express + Socket.IO + MySQL
- **Frontend**: Vanilla JS + Socket.IO client
- **Database**: MySQL with transaction support
- **Auth**: JWT-based authentication

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/stocks` - List all stocks
- `GET /api/stocks/:symbol` - Get stock details
- `POST /api/trade/buy` - Buy stocks
- `POST /api/trade/sell` - Sell stocks
- `GET /api/transactions` - Get transaction history
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add to watchlist

## WebSocket Events

- `price_update` - Real-time price updates
- `portfolio_update` - Portfolio changes
