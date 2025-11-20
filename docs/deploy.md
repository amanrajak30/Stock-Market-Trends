# Deployment Checklist

## Pre-deployment

1. Set environment variables in production
   - DB credentials
   - JWT_SECRET (strong random string)
   - MARKET_API_KEY
   - CORS_ORIGIN (production frontend URL)

2. Database setup
   - Run schema.sql to create tables
   - Set up database backups
   - Configure connection pooling

3. Security
   - Enable HTTPS
   - Set secure CORS origins
   - Configure rate limiting
   - Review and update JWT expiration

## Docker Deployment

```bash
# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Manual Deployment

### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Monitoring

- Check /health endpoint for server status
- Monitor logs in logs/app.log
- Set up alerts for errors
- Monitor database performance

## Scaling

- Use load balancer for multiple backend instances
- Configure Redis for Socket.IO adapter (multi-server)
- Set up database read replicas
- Use CDN for frontend assets
