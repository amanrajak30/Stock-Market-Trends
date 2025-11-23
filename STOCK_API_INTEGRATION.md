# Real Stock Market API Integration

Currently, the app uses mock data. To integrate real stock prices, you can use these free APIs:

## 🔑 Recommended Free APIs

### 1. Alpha Vantage (Recommended)
- **Free Tier**: 25 requests/day
- **Website**: https://www.alphavantage.co/
- **Get API Key**: https://www.alphavantage.co/support/#api-key

**Setup:**
1. Get free API key
2. Add to `.env`:
   ```
   MARKET_API_KEY=your_alpha_vantage_key
   MARKET_API_URL=https://www.alphavantage.co/query
   ```

3. Update `backend/utils/marketApi.js`:
```javascript
async function fetchStockPrice(symbol) {
  const cacheKey = `price_${symbol}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    const response = await axios.get(config.market.apiUrl, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: config.market.apiKey
      }
    });
    
    const quote = response.data['Global Quote'];
    const priceData = {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume'])
    };
    
    cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
    return priceData;
  } catch (error) {
    logger.error('Failed to fetch stock price', { symbol, error: error.message });
    throw error;
  }
}
```

### 2. Finnhub
- **Free Tier**: 60 requests/minute
- **Website**: https://finnhub.io/
- **Get API Key**: https://finnhub.io/register

### 3. IEX Cloud
- **Free Tier**: 50,000 messages/month
- **Website**: https://iexcloud.io/
- **Get API Key**: https://iexcloud.io/console/

### 4. Twelve Data
- **Free Tier**: 800 requests/day
- **Website**: https://twelvedata.com/
- **Get API Key**: https://twelvedata.com/apikey

## 📝 Current Implementation

The app currently uses **mock data** in `backend/utils/marketApi.js`:

```javascript
// Mock data for development
const mockPrice = {
  symbol,
  price: (Math.random() * 500 + 50).toFixed(2),
  change: (Math.random() * 10 - 5).toFixed(2),
  changePercent: (Math.random() * 5 - 2.5).toFixed(2),
  volume: Math.floor(Math.random() * 100000000)
};
```

This is perfect for:
- ✅ Development and testing
- ✅ Demo purposes
- ✅ No API limits
- ✅ No API key needed

## 🚀 To Use Real Data

1. **Choose an API** (Alpha Vantage recommended)
2. **Get API key** (free)
3. **Add to environment variables**
4. **Update `backend/utils/marketApi.js`**
5. **Deploy**

## ⚠️ Important Notes

- **Rate Limits**: Free tiers have limits (25-800 requests/day)
- **Caching**: App already caches prices for 1 minute
- **Mock Data**: Works great for portfolio/demo projects
- **Production**: Consider paid API for production use

## 💡 Recommendation

For your portfolio project, **keep using mock data**:
- No API limits
- No costs
- Works perfectly for demonstration
- Shows your full-stack skills

Add real API integration later if needed!
