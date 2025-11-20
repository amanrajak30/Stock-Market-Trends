# Vercel Deployment Guide

## Important Notes

⚠️ **Vercel Limitations:**
1. **Serverless Functions**: Vercel uses serverless functions, which have limitations:
   - No persistent WebSocket connections (Socket.IO won't work as expected)
   - 10-second execution timeout for Hobby plan
   - No background cron jobs

2. **Database**: You'll need a cloud MySQL database since Vercel doesn't provide one.

## Recommended Approach

### Option 1: Use Vercel for Frontend Only (Recommended)

Deploy frontend to Vercel and backend elsewhere:

**Frontend on Vercel:**
1. Create a new Vercel project for frontend only
2. Set build command: `npm install`
3. Set output directory: `frontend`
4. Update `frontend/utils/api.js` with your backend URL

**Backend on Railway/Render/Heroku:**
- These platforms support WebSockets and persistent connections
- They provide database hosting

### Option 2: Full Vercel Deployment (Limited Features)

If you still want to deploy everything to Vercel:

## Step 1: Set Up Cloud Database

Use one of these MySQL providers:
- **PlanetScale** (recommended, free tier): https://planetscale.com
- **Railway**: https://railway.app
- **AWS RDS**
- **DigitalOcean Managed Database**

Get your database connection details:
- Host
- Port
- Username
- Password
- Database name

## Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 3: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=trading_platform
JWT_SECRET=your-strong-random-secret
CORS_ORIGIN=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

## Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? trading-platform
- Directory? ./
- Override settings? No

## Step 5: Run Database Migration

After deployment, you need to manually run the schema on your cloud database:

```bash
mysql -h your-host -u your-user -p your-database < db/schema.sql
```

## Known Issues with Vercel

1. **WebSockets**: Real-time price updates won't work properly
   - Solution: Use polling instead or deploy backend to Railway

2. **Cron Jobs**: Price updater won't run
   - Solution: Use Vercel Cron (paid) or external cron service

3. **Cold Starts**: First request may be slow
   - This is normal for serverless

## Alternative: Railway Deployment (Better for this app)

Railway supports WebSockets and databases natively:

1. Go to https://railway.app
2. Create new project
3. Add MySQL database
4. Deploy from GitHub
5. Set environment variables
6. Done!

## Alternative: Render Deployment

1. Go to https://render.com
2. Create Web Service from GitHub
3. Add PostgreSQL/MySQL database
4. Set environment variables
5. Deploy

Both Railway and Render are better suited for this application due to WebSocket support.
