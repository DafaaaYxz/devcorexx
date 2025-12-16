import { defineStore } from 'pinia';
import axios from 'axios';

// HARDCODED IP VPS
const API_URL = 'https://devcore-backends.vercel.app/api';

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
      this.token = res.data.token;
      this.user = res.data;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    
    // FUNGSI BARU: Refresh data user tanpa logout
    async fetchProfile() {
      if (!this.token) return;
      try {
      } catch (e) {
        console.error("Failed to refresh profile");
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
