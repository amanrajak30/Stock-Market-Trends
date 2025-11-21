# 🚀 Live Deployment Guide

Your app is configured and ready for live deployment!

## Backend: Already Live on Railway ✅
**URL:** https://trading-platform-backend-production-99a6.up.railway.app

## Frontend: Deploy to Vercel

### Step 1: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login" with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Find and select: `amanrajak30/Stock-Market-Trends`
   - Click "Import"

3. **Configure Project:**
   ```
   Framework Preset: Other
   Root Directory: frontend
   Build Command: npm install
   Output Directory: . (just a dot)
   Install Command: npm install
   ```

4. **Click "Deploy"**
   - Wait 1-2 minutes
   - You'll get a URL like: `stock-market-trends.vercel.app`

### Step 2: Update Railway Backend CORS

After getting your Vercel URL:

1. Go to Railway dashboard: https://railway.app
2. Click on your backend service
3. Go to "Variables" tab
4. Add/Update this variable:
   ```
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   ```
   Replace with your actual Vercel URL

5. Click "Save" - Railway will automatically redeploy

### Step 3: Test Your Live App

1. Open your Vercel URL in browser
2. Sign up for a new account
3. Try buying/selling stocks
4. Check real-time updates

## 🎯 Your Live URLs

After deployment:
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://trading-platform-backend-production-99a6.up.railway.app
- **GitHub:** https://github.com/amanrajak30/Stock-Market-Trends

## 🔧 Environment Variables (Railway)

Make sure these are set in Railway:

```
DB_HOST=<auto-configured by Railway MySQL>
DB_PORT=<auto-configured by Railway MySQL>
DB_USER=<auto-configured by Railway MySQL>
DB_PASSWORD=<auto-configured by Railway MySQL>
DB_NAME=<auto-configured by Railway MySQL>
JWT_SECRET=<generate a strong random string>
CORS_ORIGIN=https://your-vercel-url.vercel.app
NODE_ENV=production
```

## 📊 Database Setup

If you haven't run the database migration yet:

1. In Railway, click on your MySQL database
2. Click "Connect" tab
3. Copy the connection command
4. Run locally:
   ```bash
   mysql -h <host> -u <user> -p<password> <database> < db/schema.sql
   ```

Or use Railway's built-in query editor to paste the schema.

## ✅ Checklist

- [ ] Backend deployed on Railway
- [ ] MySQL database created on Railway
- [ ] Database schema migrated
- [ ] Frontend deployed on Vercel
- [ ] CORS_ORIGIN updated in Railway
- [ ] Test signup/login
- [ ] Test trading functionality
- [ ] Test real-time updates

## 🎉 You're Live!

Share your app: `https://your-app.vercel.app`

## 🔄 Future Updates

To update your live app:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Both Railway and Vercel will automatically redeploy!

## 🆘 Troubleshooting

**CORS Error?**
- Make sure CORS_ORIGIN in Railway matches your Vercel URL exactly
- Include https:// and no trailing slash

**Database Connection Error?**
- Check Railway MySQL is running
- Verify environment variables are set
- Run the schema migration

**WebSocket Not Working?**
- Railway supports WebSockets by default
- Check browser console for connection errors
- Verify Socket.IO is connecting to correct URL

**Frontend Not Loading?**
- Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors
