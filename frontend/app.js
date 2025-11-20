class App {
  constructor() {
    this.init();
  }

  async init(user = null) {
    if (api.token && !user) {
      try {
        const data = await api.get('/trade/portfolio');
        user = { email: 'User', ...data };
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
      } catch (error) {
        api.clearToken();
        document.getElementById('authModal').style.display = 'flex';
        return;
      }
    }

    if (user) {
      await dashboard.init(user);
      market.connect(api.token);
    } else {
      document.getElementById('authModal').style.display = 'flex';
    }
  }
}

window.app = new App();
