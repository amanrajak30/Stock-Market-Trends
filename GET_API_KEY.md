# Get Your Free Stock Market API Key

## 🔑 Finnhub API (Recommended - Free Forever)

### Why Finnhub?
- ✅ **Free forever** - No credit card required
- ✅ **60 requests/minute** - Perfect for your app
- ✅ **Real-time data** - Actual stock prices
- ✅ **Easy setup** - 2 minutes

### Step-by-Step Guide:

#### 1. Sign Up (1 minute)
1. Go to: https://finnhub.io/register
2. Enter your email
3. Create a password
4. Click "Sign Up"
5. Verify your email (check inbox)

#### 2. Get API Key (30 seconds)
1. After login, you'll see your dashboard
2. Your API key is displayed at the top
3. Copy the API key (looks like: `abc123xyz456...`)

#### 3. Add to Your Project (30 seconds)

**Local Development:**
1. Open `.env` file in your project
2. Find the line: `MARKET_API_KEY=`
3. Paste your API key:
   ```
   MARKET_API_KEY=your_actual_api_key_here
   ```
4. Save the file
5. Restart your backend server

**Render Deployment:**
1. Go to your backend service on Render
2. Click "Environment"
3. Add new variable:
   - Key: `MARKET_API_KEY`
   - Value: Your Finnhub API key
4. Click "Save Changes"
5. Render will automatically redeploy

#### 4. Test It! (1 minute)
1. Restart your app
2. Check backend logs - you should see:
   ```
   Fetched real stock price { symbol: 'AAPL', price: '175.50' }
   ```
3. Open your app - prices are now REAL! 🎉

## 📊 What You Get

**Free Tier Includes:**
- 60 API calls per minute
- Real-time stock quotes
- US stocks (NYSE, NASDAQ)
- Historical data
- Company profiles
- No credit card required
- No expiration

**Perfect for:**
- ✅ Your trading platform
- ✅ Portfolio projects
- ✅ Learning projects
- ✅ Small apps

## 🔄 How It Works

Your app now:
1. **Checks cache first** (1 minute cache)
2. **Calls Finnhub API** if cache expired
3. **Falls back to mock data** if API fails
4. **Updates every minute** via cron job

This means:
- Real prices for all stocks
- Efficient API usage (respects rate limits)
- Always works (fallback to mock if needed)

## ⚠️ Important Notes

### Rate Limits:
- **60 requests/minute** on free tier
- Your app caches for 1 minute
- With 20 stocks, you use ~20 requests/minute
- Plenty of headroom! ✅

### API Key Security:
- ✅ Never commit `.env` to GitHub
- ✅ `.env` is in `.gitignore`
- ✅ Use environment variables on Render
- ✅ Keep your API key private

### Without API Key:
- App still works perfectly
- Uses realistic mock data
- Great for development/testing
- No API limits

## 🎯 Quick Commands

**Add API key locally:**
```bash
# Edit .env file
MARKET_API_KEY=your_key_here

# Restart backend
cd backend
npm start
```

**Check if it's working:**
Look for this in backend logs:
```
INFO: Fetched real stock price { symbol: 'AAPL', price: '175.50' }
```

If you see:
```
WARN: No API key configured, using mock data
```
Then add your API key!

## 🆓 Alternative Free APIs

If you want to try others:

### Alpha Vantage
- **Free**: 25 requests/day
- **Get key**: https://www.alphavantage.co/support/#api-key
- Good for low-traffic apps

### IEX Cloud
- **Free**: 50,000 messages/month
- **Get key**: https://iexcloud.io/console/
- More features, complex setup

### Twelve Data
- **Free**: 800 requests/day
- **Get key**: https://twelvedata.com/apikey
- Good alternative to Finnhub

## ✅ Checklist

- [ ] Signed up for Finnhub
- [ ] Verified email
- [ ] Copied API key
- [ ] Added to `.env` file (local)
- [ ] Added to Render environment variables (production)
- [ ] Restarted backend
- [ ] Checked logs for "Fetched real stock price"
- [ ] Tested app - seeing real prices!

## 🎉 You're Done!

Your trading platform now shows **REAL stock prices**!

**Next Steps:**
- Deploy to Render
- Add API key to Render environment
- Share your live app!

Questions? Check the logs or `STOCK_API_INTEGRATION.md` for more details.
