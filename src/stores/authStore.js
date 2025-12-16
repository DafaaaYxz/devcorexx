import { defineStore } from 'pinia';
import axios from 'axios';

// URL API BARU SESUAI REQUEST
const API_URL = 'https://wanzofc-dev.vercel.app/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    async login(credentials) {
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      this.setUserData(res.data);
    },
    
    async fetchProfile() {
      if (!this.token) return;
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        this.setUserData(res.data, false);
      } catch (e) {
        console.error("Gagal refresh profile:", e);
        if(e.response && e.response.status === 401) this.logout();
      }
    },

    setUserData(data, updateToken = true) {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(data));
      if (updateToken && data.token) {
          this.token = data.token;
          localStorage.setItem('token', data.token);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});
