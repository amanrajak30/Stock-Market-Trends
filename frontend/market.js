class Market {
  constructor() {
    this.socket = null;
    this.marketSocket = null;
  }

  connect(token) {
    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : 'https://your-backend-url.vercel.app';
    
    // Private socket for user updates
    this.socket = io(socketUrl, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to private socket');
    });

    this.socket.on('portfolio_update', (data) => {
      console.log('Portfolio updated:', data);
      window.dashboard.loadPortfolio();
    });

    // Market socket for price updates
    this.marketSocket = io(`${socketUrl}/market`);

    this.marketSocket.on('connect', () => {
      console.log('Connected to market feed');
      this.subscribeToStocks();
    });

    this.marketSocket.on('price_update', (data) => {
      this.handlePriceUpdate(data);
    });
  }

  subscribeToStocks() {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    this.marketSocket.emit('subscribe', symbols);
  }

  handlePriceUpdate(data) {
    const stockElement = document.querySelector(`[data-symbol="${data.symbol}"]`);
    if (stockElement) {
      const priceElement = stockElement.querySelector('.stock-price');
      if (priceElement) {
        priceElement.textContent = `$${parseFloat(data.price).toFixed(2)}`;
        priceElement.className = 'stock-price ' + (data.change >= 0 ? 'positive' : 'negative');
      }
    }
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
    if (this.marketSocket) this.marketSocket.disconnect();
  }
}

const market = new Market();
