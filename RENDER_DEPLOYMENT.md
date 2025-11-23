# Deploy to Render - Complete Guide

## 🚀 Deploy Full-Stack App on Render

### Prerequisites
- GitHub account with your code pushed
- MongoDB Atlas account (free tier)

## Step 1: Set Up MongoDB Atlas (Free)

1. **Go to**: https://cloud.mongodb.com
2. **Sign up** for free
3. **Create Cluster**:
   - Choose "FREE" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"
4. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `tradingapp`
   - Password: Generate secure password (SAVE THIS!)
   - Privileges: "Read and write to any database"
5. **Whitelist IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://tradingapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trading_platform?retryWrites=true&w=majority`

## Step 2: Deploy Backend on Render

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select repository: `Stock-Market-Trends`
   - Click "Connect"

4. **Configure Service**:
   ```
   Name: stock-trading-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   ```
   MONGODB_URI=mongodb+srv://tradingapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trading_platform?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_random_key_here_make_it_long_and_secure
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=*
   ```

6. **Select Plan**:
   - Choose "Free" plan
   - Click "Create Web Service"

7. **Wait for Deployment** (2-3 minutes)
   - Render will build and deploy
   - You'll get a URL like: `https://stock-trading-backend.onrender.com`

## Step 3: Deploy Frontend on Render

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Select same repository: `Stock-Market-Trends`

2. **Configure Static Site**:
   ```
   Name: stock-trading-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install
   Publish Directory: .
   ```

3. **Add Environment Variable**:
   ```
   NODE_ENV=production
   ```

4. **Select Plan**:
   - Choose "Free" plan
   - Click "Create Static Site"

5. **You'll get a URL like**: `https://stock-trading-frontend.onrender.com`

## Step 4: Update Backend CORS

1. Go to your backend service on Render
2. Click "Environment"
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://stock-trading-frontend.onrender.com
   ```
4. Click "Save Changes"
5. Render will automatically redeploy

## Step 5: Update Frontend API URL

You need to update the frontend to point to your backend URL.

**Option A: Use Environment Variable (Recommended)**

Update `frontend/utils/api.js`:
```javascript
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://stock-trading-backend.onrender.com/api';
```

**Option B: Manual Update**

Just replace `stock-trading-backend` with your actual backend URL.

## Step 6: Push Changes

```bash
git add .
git commit -m "Updated for Render deployment"
git push origin main
```

Both services will auto-redeploy!

## 🎯 Your Live URLs

- **Frontend**: https://stock-trading-frontend.onrender.com
- **Backend API**: https://stock-trading-backend.onrender.com
- **MongoDB**: Hosted on Atlas

## ⚠️ Important Notes

### Free Tier Limitations:
- **Spin down after 15 min of inactivity**
- First request after spin down takes 30-60 seconds
- 750 hours/month free (enough for one service 24/7)

### WebSocket Support:
- ✅ Render supports WebSockets on free tier
- No extra configuration needed

### Auto-Deploy:
- Every GitHub push triggers automatic deployment
- Check deployment logs in Render dashboard

## 🐛 Troubleshooting

**Backend not starting?**
- Check logs in Render dashboard
- Verify MongoDB connection string
- Ensure all environment variables are set

**Frontend can't connect to backend?**
- Check CORS_ORIGIN matches frontend URL
- Verify backend URL in frontend code
- Check browser console for errors

**Database connection failed?**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string password
- Ensure database user has correct permissions

**App is slow on first load?**
- Normal for free tier (cold start)
- Upgrade to paid plan ($7/month) for always-on

## 💰 Pricing

**Free Tier:**
- 750 hours/month per service
- Spins down after 15 min inactivity
- Perfect for testing/portfolio projects

**Starter Plan ($7/month per service):**
- Always on (no spin down)
- Better performance
- Custom domains

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Backend deployed on Render
- [ ] Environment variables set
- [ ] Frontend deployed on Render
- [ ] CORS_ORIGIN updated
- [ ] Frontend API URL updated
- [ ] Code pushed to GitHub
- [ ] Both services deployed successfully
- [ ] App tested and working

## 🔄 Update Your App

To update your live app:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically redeploys both services!

## 🎉 You're Live!

Your stock trading platform is now live on Render!

**Share your app:**
- Frontend: `https://your-frontend.onrender.com`
- Add to portfolio/resume
- Share with friends

**Next Steps:**
- Add custom domain (paid plan)
- Monitor usage in Render dashboard
- Upgrade to paid plan for production use
