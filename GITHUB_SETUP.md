# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `stock-trading-platform` (or your preferred name)
3. Description: "Real-time stock trading platform with WebSocket support"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

## Step 3: Deploy to Railway (Recommended)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `stock-trading-platform` repository
5. Railway will automatically detect and deploy
6. Add MySQL database:
   - Click "New" → "Database" → "Add MySQL"
   - Railway will auto-configure the connection
7. Add environment variables:
   - JWT_SECRET: (generate a random string)
   - CORS_ORIGIN: (will be provided after deployment)
8. Your app will be live!

## Alternative: Deploy to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect settings
5. Add PostgreSQL database or connect external MySQL
6. Set environment variables
7. Deploy!

## Environment Variables Needed

```
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=trading_platform
JWT_SECRET=your-random-secret-key
CORS_ORIGIN=https://your-frontend-url
NODE_ENV=production
```

## After Deployment

1. Run database migration on your cloud database
2. Update frontend API URLs if needed
3. Test the application
4. Share your live URL!

Your repository is ready to push! 🚀
