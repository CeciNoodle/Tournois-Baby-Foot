import axios from 'axios';

const api = axios.create({
  baseURL:         'http://localhost:3000/api',
  withCredentials: true, // envoie le cookie refreshToken automatiquement
});


let _auth = null;

export function setAuth(auth) {
  _auth = auth;
}


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post('/auth/refresh');
        _auth.setSession(data.accessToken, data.user);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        _auth.clearSession();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;