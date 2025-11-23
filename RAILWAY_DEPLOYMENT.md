# Deploy to Railway - Complete Guide

## 🚀 Quick Deployment (5 minutes)

### Step 1: Sign Up
1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `amanrajak30/Stock-Market-Trends`
4. Railway will start deploying automatically

### Step 3: Add MongoDB Database
1. In your project dashboard, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway will create and connect MongoDB automatically
4. Connection string is auto-configured!

### Step 4: Configure Environment Variables
1. Click on your service (backend)
2. Go to "Variables" tab
3. Add these variables:
   ```
   JWT_SECRET=your_random_secret_key_here_make_it_long
   NODE_ENV=production
   ```
   (MONGODB_URI is auto-set by Railway)

### Step 5: Get Your URL
1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Copy your URL (e.g., `your-app.up.railway.app`)

### Step 6: Update CORS
1. In Railway, go to Variables
2. Add:
   ```
   CORS_ORIGIN=https://your-app.up.railway.app
   ```

### Step 7: Done! 🎉
Your app is live at: `https://your-app.up.railway.app`

## 📝 Important Notes

- Railway serves both frontend and backend from the same URL
- Frontend is served from `/` 
- Backend API is at `/api/*`
- WebSockets work automatically
- Auto-deploys on every GitHub push

## 💰 Pricing

- **Free Tier**: $5 credit/month (enough for small projects)
- **Hobby**: $5/month for more resources
- **Pro**: $20/month for production apps

## 🔄 Auto-Deploy

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
Railway automatically redeploys!

## 🐛 Troubleshooting

**App not loading?**
- Check deployment logs in Railway dashboard
- Verify MongoDB is connected
- Check environment variables

**Database connection error?**
- Railway auto-configures MONGODB_URI
- No manual setup needed!

**WebSocket not working?**
- Railway supports WebSockets by default
- No extra configuration needed

## 🎯 Your Live URLs

After deployment:
- **Full App**: https://your-app.up.railway.app
- **API**: https://your-app.up.railway.app/api
- **GitHub**: https://github.com/amanrajak30/Stock-Market-Trends

## ✅ Checklist

- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] MongoDB database added
- [ ] Environment variables set
- [ ] Domain generated
- [ ] CORS_ORIGIN updated
- [ ] App tested and working

You're done! Your stock trading platform is live! 🚀📈
