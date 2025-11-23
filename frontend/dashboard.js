class Dashboard {
  constructor() {
    this.user = null;
  }

  async init(user) {
    this.user = user;
    document.getElementById('userEmail').textContent = user.email;
    
    document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    
    await this.loadPortfolio();
    await this.loadStocks();
    await this.loadWatchlist();
  }

  async loadPortfolio() {
    try {
      const data = await api.get('/trade/portfolio');
      
      document.getElementById('cashBalance').textContent = `$${data.cashBalance.toFixed(2)}`;
      document.getElementById('holdingsValue').textContent = `$${data.totalValue.toFixed(2)}`;
      document.getElementById('totalValue').textContent = `$${data.totalPortfolioValue.toFixed(2)}`;
      
      const holdingsList = document.getElementById('holdingsList');
      holdingsList.innerHTML = '';
      
      data.holdings.forEach(holding => {
        const div = document.createElement('div');
        div.className = 'holding-item';
        div.innerHTML = `
          <div class="stock-info">
            <div class="stock-symbol">${holding.symbol}</div>
            <div class="stock-name">${holding.quantity} shares @ $${holding.avgPrice.toFixed(2)}</div>
          </div>
          <div>
            <div class="stock-price ${holding.profitLoss >= 0 ? 'positive' : 'negative'}">
              $${holding.currentPrice.toFixed(2)}
            </div>
            <div class="stock-name ${holding.profitLoss >= 0 ? 'positive' : 'negative'}">
              ${holding.profitLoss >= 0 ? '+' : ''}$${holding.profitLoss.toFixed(2)}
            </div>
          </div>
        `;
        holdingsList.appendChild(div);
      });
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }
  }

  async loadStocks() {
    try {
      const data = await api.get('/stocks');
      this.allStocks = data.stocks;
      this.renderStocks(this.allStocks);
      
      // Setup search
      const searchInput = document.getElementById('stockSearch');
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = this.allStocks.filter(stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
        );
        this.renderStocks(filtered);
      });
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
  }

  renderStocks(stocks) {
    const stocksList = document.getElementById('stocksList');
    stocksList.innerHTML = '';
    
    if (stocks.length === 0) {
      stocksList.innerHTML = '<p style="padding: 1rem; text-align: center; color: #666;">No stocks found</p>';
      return;
    }
    
    stocks.forEach(stock => {
      const div = document.createElement('div');
      div.className = 'stock-item';
      div.dataset.symbol = stock.symbol;
      div.innerHTML = `
        <div class="stock-info">
          <div class="stock-symbol">${stock.symbol}</div>
          <div class="stock-name">${stock.name}</div>
        </div>
        <div class="stock-price ${stock.change_percent >= 0 ? 'positive' : 'negative'}">
          $${parseFloat(stock.last_price).toFixed(2)}
        </div>
      `;
      div.addEventListener('click', () => trade.openModal(stock));
      stocksList.appendChild(div);
    });
  }

  async loadWatchlist() {
    try {
      const data = await api.get('/watchlist');
      
      const watchlistItems = document.getElementById('watchlistItems');
      watchlistItems.innerHTML = '';
      
      if (data.watchlist.length === 0) {
        watchlistItems.innerHTML = '<p>No items in watchlist</p>';
        return;
      }
      
      data.watchlist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'stock-item';
        div.innerHTML = `
          <div class="stock-info">
            <div class="stock-symbol">${item.symbol}</div>
            <div class="stock-name">${item.name}</div>
          </div>
          <div class="stock-price">
            $${parseFloat(item.last_price).toFixed(2)}
          </div>
        `;
        div.addEventListener('click', () => trade.openModal(item));
        watchlistItems.appendChild(div);
      });
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  }

  showNotification(message) {
    // Simple notification - can be enhanced
    alert(message);
  }

  logout() {
    api.clearToken();
    market.disconnect();
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('authModal').style.display = 'flex';
  }
}

const dashboard = new Dashboard();
window.dashboard = dashboard;
