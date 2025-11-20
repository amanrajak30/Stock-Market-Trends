class Trade {
  constructor() {
    this.currentStock = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = document.querySelector('#tradeModal .close');
    const buyBtn = document.getElementById('buyBtn');
    const sellBtn = document.getElementById('sellBtn');

    closeBtn.addEventListener('click', () => this.closeModal());
    buyBtn.addEventListener('click', () => this.executeTrade('BUY'));
    sellBtn.addEventListener('click', () => this.executeTrade('SELL'));
  }

  openModal(stock) {
    this.currentStock = stock;
    
    document.getElementById('tradeSymbol').textContent = stock.symbol;
    document.getElementById('tradePrice').textContent = `$${parseFloat(stock.last_price).toFixed(2)}`;
    document.getElementById('tradeQuantity').value = '';
    document.getElementById('tradeError').textContent = '';
    document.getElementById('tradeModal').style.display = 'flex';
  }

  closeModal() {
    document.getElementById('tradeModal').style.display = 'none';
    this.currentStock = null;
  }

  async executeTrade(type) {
    const quantity = parseInt(document.getElementById('tradeQuantity').value);
    const errorDiv = document.getElementById('tradeError');

    if (!quantity || quantity < 1) {
      errorDiv.textContent = 'Please enter a valid quantity';
      return;
    }

    try {
      const endpoint = type === 'BUY' ? '/trade/buy' : '/trade/sell';
      const data = await api.post(endpoint, {
        symbol: this.currentStock.symbol,
        quantity
      });

      this.closeModal();
      window.dashboard.loadPortfolio();
      window.dashboard.showNotification(`${type} order executed successfully!`);
    } catch (error) {
      errorDiv.textContent = error.message;
    }
  }
}

const trade = new Trade();
