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
      console.log('Executing trade:', { type, symbol: this.currentStock.symbol, quantity });
      const endpoint = type === 'BUY' ? '/trade/buy' : '/trade/sell';
      const data = await api.post(endpoint, {
        symbol: this.currentStock.symbol,
        quantity
      });

      console.log('Trade successful:', data);
      this.closeModal();
      window.dashboard.loadPortfolio();
      alert(`${type} order executed successfully!`);
    } catch (error) {
      console.error('Trade failed:', error);
      errorDiv.textContent = error.message || 'Trade failed. Please try again.';
    }
  }
}

const trade = new Trade();
