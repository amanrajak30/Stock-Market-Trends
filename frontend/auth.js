class Auth {
  constructor() {
    this.isLogin = true;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const authForm = document.getElementById('authForm');
    const toggleAuth = document.getElementById('toggleAuth');

    authForm.addEventListener('submit', (e) => this.handleSubmit(e));
    toggleAuth.addEventListener('click', (e) => this.toggleMode(e));
  }

  toggleMode(e) {
    e.preventDefault();
    this.isLogin = !this.isLogin;
    
    const title = document.getElementById('authTitle');
    const submit = document.getElementById('authSubmit');
    const toggle = document.getElementById('authToggle');
    const link = document.getElementById('toggleAuth');

    if (this.isLogin) {
      title.textContent = 'Login';
      submit.textContent = 'Login';
      toggle.innerHTML = "Don't have an account? <a href='#' id='toggleAuth'>Sign up</a>";
    } else {
      title.textContent = 'Sign Up';
      submit.textContent = 'Sign Up';
      toggle.innerHTML = "Already have an account? <a href='#' id='toggleAuth'>Login</a>";
    }

    document.getElementById('toggleAuth').addEventListener('click', (e) => this.toggleMode(e));
    document.getElementById('authError').textContent = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('authError');

    try {
      const endpoint = this.isLogin ? '/auth/login' : '/auth/signup';
      const data = await api.post(endpoint, { email, password });

      api.setToken(data.token);
      
      document.getElementById('authModal').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      
      window.app.init(data.user);
    } catch (error) {
      errorDiv.textContent = error.message;
    }
  }

  checkAuth() {
    return !!api.token;
  }
}

const auth = new Auth();
