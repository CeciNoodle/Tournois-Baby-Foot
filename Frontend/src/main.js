import './style.css';
import { createApp, reactive } from 'vue';
import App            from './App.vue';
import router         from './router/index.js';
import api, { setAuth } from './services/api.js';
import * as authService from './services/auth-service.js';

//Stato globale di auth.
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
  },


  clearSession() {
    authState.accessToken = null;
    authState.user        = null;
    delete api.defaults.headers.common.Authorization;
  },


  async login(email, password) {
    const data = await authService.login(email, password);
    this.setSession(data.accessToken, data.user);
  },


  async logout() {
    await authService.logout();
    this.clearSession();
  },

 
  async restoreSession() {
    try {
      const data = await authService.refresh();
      this.setSession(data.accessToken, data.user);
    } catch {
      this.clearSession();
    }
  },
};


setAuth(auth);


auth.restoreSession().finally(() => {
  const app = createApp(App);
  app.provide('auth', auth); 
  app.use(router);


  router._auth = auth;

  app.mount('#app');
});