<template>
  <div class="container slide-in">
    <h1 class="retro-font text-center" style="margin-bottom:30px; color:var(--primary)">USER PROFILE</h1>
    
    <div class="profile-grid">
        <!-- CARD 1: IDENTITY -->
        <div class="card">
            <h3 class="retro-font section-title">IDENTITY</h3>
            <div class="avatar-box">
                <img :src="auth.user?.avatarUrl" class="avatar-img" alt="Avatar">
            </div>
            <div class="info-row">
                <label>USERNAME</label>
                <div class="val">{{ auth.user?.username }}</div>
            </div>
            <div class="info-row">
                <label>ROLE</label>
                <div class="val" style="color:var(--accent)">{{ auth.user?.role?.toUpperCase() }}</div>
            </div>
            <div class="info-row">
                <label>STATUS</label>
                <div class="val" :style="{color: auth.user?.isApproved ? '#10b981' : '#fbbf24'}">
                    {{ auth.user?.isApproved ? 'APPROVED' : 'PENDING' }}
                </div>
            </div>
        </div>

        <!-- CARD 2: SECURITY (CHANGE PASS) -->
        <div class="card">
            <h3 class="retro-font section-title">SECURITY</h3>
            <form @submit.prevent="changePass">
                <label>OLD PASSWORD</label>
                <input v-model="pass.old" type="password" class="input-field" required>
                
                <label>NEW PASSWORD</label>
                <input v-model="pass.new" type="password" class="input-field" required>
                
                <button type="submit" class="btn w-full">UPDATE PASSWORD</button>
            </form>
        </div>

        <!-- CARD 3: DEVELOPER API -->
        <div class="card full-width">
            <h3 class="retro-font section-title">DEVELOPER API</h3>
            <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">
                Use this API Key to access DevCORE AI via cURL, Python, or Postman.
                Read <router-link to="/docs" style="color:var(--accent)">Documentation</router-link> for usage.
            </p>
            
            <div class="api-box">
                <div class="key-display">
                    {{ auth.user?.personalApiKey || 'NO API KEY GENERATED' }}
                </div>
                <button @click="generateKey" class="btn">
                    <i class="fas fa-sync"></i> {{ auth.user?.personalApiKey ? 'REGENERATE' : 'GENERATE' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const auth = useAuthStore();
const pass = reactive({ old: '', new: '' });
const API = 'https://devcore-backends.vercel.app/api';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const changePass = async () => {
    try {
        await axios.post(`${API}/auth/change-password`, { oldPassword: pass.old, newPassword: pass.new }, headers);
        alert('Password Changed Successfully!');
        pass.old = ''; pass.new = '';
    } catch(e) { alert('Failed: ' + e.response?.data?.message); }
};

const generateKey = async () => {
    if(!confirm('Generate new API Key? Old key will stop working.')) return;
    try {
        const res = await axios.post(`${API}/auth/generate-key`, {}, headers);
        auth.fetchProfile(); // Refresh store
        alert('New API Key Generated!');
    } catch(e) { alert('Error generating key'); }
};

onMounted(() => {
    auth.fetchProfile();
});
</script>

<style scoped>
.profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.full-width { grid-column: 1 / -1; }
.section-title { border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-size: 0.8rem; color: #fff; }

.avatar-box { text-align: center; margin-bottom: 20px; }
.avatar-img { width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--primary); background: #000; }

.info-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; border-bottom: 1px solid #111; padding-bottom: 5px; }
.info-row label { color: #666; font-size: 0.7rem; }
.info-row .val { color: #ccc; font-family: 'Courier New'; font-weight: bold; }

.api-box { display: flex; gap: 10px; align-items: center; background: #000; padding: 15px; border: 1px solid var(--accent); border-radius: 4px; }
.key-display { flex: 1; font-family: 'Courier New'; font-size: 1rem; color: var(--accent); letter-spacing: 1px; word-break: break-all; }
</style>
