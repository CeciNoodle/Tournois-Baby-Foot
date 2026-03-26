import './style.css';
import { createApp, reactive } from 'vue';
import App            from './App.vue';
import router         from './router/index.js';
import api, { setAuth } from './services/api.js';
import * as authService from './services/auth-service.js';

const authState = reactive({
  accessToken: null,
  user:        null,
});

const auth = {
  state: authState,

  get isAuthenticated() { return !!authState.accessToken; },
  get isAdmin()         { return authState.user?.role === 'admin'; },

  setSession(token, userData) {
    authState.accessToken = token;
    authState.user        = userData;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  },

  clearSession() {
    authState.accessToken = null;
    authState.user        = null;
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  async login(email, password) {
    const data = await authService.login(email, password);
    this.setSession(data.accessToken, data.user);
  },

  async logout() {
    await authService.logout();
    this.clearSession();
  },

  restoreSession() {
    const token = localStorage.getItem('accessToken');
    const user  = localStorage.getItem('user');
    if (token && user) {
      this.setSession(token, JSON.parse(user));
    }
  },
};

setAuth(auth);
auth.restoreSession();

const app = createApp(App);
app.provide('auth', auth);
app.use(router);
router._auth = auth;
app.mount('#app');