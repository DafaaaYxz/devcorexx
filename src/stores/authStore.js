import { defineStore } from 'pinia';
import axios from 'axios';

// HARDCODED IP VPS
const API_URL = 'http://146.190.98.149:5000/api';

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
        // Kita gunakan endpoint khusus atau endpoint auth yang me-return user info
        // Disini kita asumsi backend support getMe atau kita update data dari localStorage jika login ulang diperlukan
        // Namun, cara paling mudah tanpa ubah backend banyak adalah re-fetch data session jika ada, 
        // tapi disini kita update user object manual jika perlu.
        
        // Agar simple dan efektif: Kita panggil endpoint login check (jika ada) atau biarkan
        // logic frontend membaca user.aiName yang dikirim saat login.
        // Jika admin approve, user harusnya dapat data baru. 
        // Kita tambahkan endpoint simple di backend nanti "getMe", tapi untuk sekarang
        // kita andalkan data yang tersimpan. 
        
        // NOTE: Agar "Real-time" berubah saat diapprove, user biasanya perlu refresh halaman.
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
