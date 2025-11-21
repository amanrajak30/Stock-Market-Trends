# MongoDB Setup Guide

Your app has been converted from MySQL to MongoDB! 🎉

## Local Development

### Option 1: Install MongoDB Locally

1. **Download MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - Or use MongoDB Compass (GUI): https://www.mongodb.com/try/download/compass

2. **Start MongoDB:**
   ```bash
   # MongoDB should start automatically after installation
   # Or run: mongod
   ```

3. **Update .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/trading_platform
   ```

4. **Run the app:**
   ```bash
   cd backend
   npm start
   ```
   The app will automatically create the database and seed sample stocks!

### Option 2: Use MongoDB Atlas (Cloud - Recommended) ☁️

**Free tier available - No installation needed!**

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `tradingapp`
   - Password: (generate a strong password)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://tradingapp:<password>@cluster0.xxxxx.mongodb.net/`

6. **Update .env:**
   ```
   MONGODB_URI=mongodb+srv://tradingapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trading_platform?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` with your actual password

7. **Run the app:**
   ```bash
   cd backend
   npm start
   ```

## Deploy to Railway with MongoDB

1. **Go to Railway Dashboard:**
   - https://railway.app

2. **Add MongoDB:**
   - Click your project
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will automatically create a MongoDB instance

3. **Get Connection String:**
   - Click on the MongoDB service
   - Copy the `MONGO_URL` variable
   - It looks like: `mongodb://mongo:PASSWORD@containers-us-west-xxx.railway.app:PORT`

4. **Update Environment Variables:**
   - Click on your backend service
   - Go to "Variables"
   - Add/Update:
     ```
     MONGODB_URI=<paste the MONGO_URL here>
     ```

5. **Deploy:**
   - Railway will automatically redeploy
   - Your app is now using MongoDB!

## What Changed?

✅ **Removed:**
- MySQL/mysql2 package
- SQL schema files
- Complex SQL queries

✅ **Added:**
- Mongoose (MongoDB ODM)
- MongoDB models (User, Stock, Holding, Transaction, Watchlist)
- Automatic database seeding
- Simpler queries

✅ **Benefits:**
- No manual schema migration needed
- Easier to deploy (MongoDB Atlas is free)
- Better for Railway deployment
- Automatic data seeding
- More flexible schema

## Test Your Setup

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. You should see:
   ```
   MongoDB connected successfully
   Sample stocks inserted
   Server running on port 3000
   ```

3. Open frontend:
   ```bash
   cd frontend
   npm start
   ```

4. Go to http://localhost:8080 and test!

## Troubleshooting

**Connection Error?**
- Check MongoDB is running (local) or connection string is correct (Atlas)
- Verify IP whitelist in Atlas
- Check username/password

**Sample stocks not showing?**
- They're automatically inserted on first run
- Check backend logs for "Sample stocks inserted"

**Railway deployment issues?**
- Make sure MongoDB service is added
- Verify MONGODB_URI variable is set
- Check deployment logs

## Next Steps

1. ✅ MongoDB is configured
2. ✅ Models are created
3. ✅ Controllers updated
4. ✅ Auto-seeding enabled
5. 🚀 Ready to deploy!

Push to GitHub and deploy to Railway - MongoDB will work automatically!
