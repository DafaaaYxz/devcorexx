<template>
  <div class="container slide-in">
    <h1 class="retro-font text-center" style="margin-bottom:30px; color:var(--primary)">USER PROFILE</h1>
    
    <div class="profile-grid">
        <!-- CARD 1: IDENTITY -->
        <div class="card identity-card">
            <h3 class="retro-font section-title">IDENTITY</h3>
            <div class="avatar-container">
                <img :src="auth.user?.avatarUrl" class="avatar-img" alt="Avatar">
                <div class="role-badge" :class="auth.user?.role">{{ auth.user?.role?.toUpperCase() }}</div>
            </div>
            
            <div class="data-group">
                <label>USERNAME</label>
                <div class="val highlight">{{ auth.user?.username }}</div>
            </div>
            
            <div class="data-group">
                <label>STATUS</label>
                <div class="val" :style="{color: auth.user?.isApproved ? '#10b981' : '#fbbf24'}">
                    {{ auth.user?.isApproved ? 'APPROVED' : 'PENDING' }}
                </div>
            </div>

            <!-- NEW COOLER STATS AREA -->
            <div class="cyber-stats">
                <div class="stat-line">
                    <span>LAST LOGIN:</span>
                    <span class="stat-val">{{ formatDate(auth.user?.lastLogin) }}</span>
                </div>
                
                <div class="stat-grid">
                    <div class="mini-stat">
                        <div class="label">REQ COUNT</div>
                        <div class="num">{{ auth.user?.apiReqCount || 0 }}</div>
                    </div>
                    <div class="mini-stat">
                        <div class="label">TOKEN USED</div>
                        <div class="num text-gold">{{ auth.user?.tokenUsage || 0 }}</div>
                    </div>
                    <div class="mini-stat">
                        <div class="label">HEALTH</div>
                        <div class="num" style="color:#f472b6;">{{ auth.user?.healthStatus || '100%' }}</div>
                    </div>
                    <div class="mini-stat">
                        <div class="label">THEME</div>
                        <div class="num" style="color:var(--primary);">CYBER</div>
                    </div>
                </div>
                
                <div class="progress-bar">
                    <div class="fill" style="width: 100%;"></div>
                </div>
                <div style="text-align:right; font-size:0.6rem; color:#444;">SYS.INTEGRITY.CHECK: OK</div>
            </div>
        </div>

        <!-- CARD 2: SECURITY -->
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

        <!-- CARD 3: API KEY -->
        <div class="card full-width">
            <h3 class="retro-font section-title">DEVELOPER API</h3>
            <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">
                Access DevCORE via external tools.
                <router-link to="/docs" style="color:var(--accent)">Read Docs</router-link>.
            </p>
            <div class="api-box">
                <div class="key-display">{{ auth.user?.personalApiKey || 'NO API KEY' }}</div>
                <button @click="generateKey" class="btn"><i class="fas fa-sync"></i> GENERATE</button>
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
const API = 'https://wanzofc-dev.vercel.app/api';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const formatDate = (dateString) => {
    if(!dateString) return 'NEVER';
    return new Date(dateString).toLocaleString();
};

const changePass = async () => {
    try {
        await axios.post(`${API}/auth/change-password`, { oldPassword: pass.old, newPassword: pass.new }, headers);
        alert('Password Changed Successfully!');
        pass.old = ''; pass.new = '';
    } catch(e) { alert('Failed: ' + e.response?.data?.message); }
};

const generateKey = async () => {
    if(!confirm('Generate new API Key?')) return;
    try {
        await axios.post(`${API}/auth/generate-key`, {}, headers);
        auth.fetchProfile(); 
        alert('Key Generated!');
    } catch(e) { alert('Error generating key'); }
};

onMounted(() => { auth.fetchProfile(); });
</script>

<style scoped>
.profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.full-width { grid-column: 1 / -1; }
.section-title { border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-size: 0.8rem; color: #fff; }

.avatar-container { position: relative; width: 100px; margin: 0 auto 20px auto; }
.avatar-img { width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--primary); background: #000; }
.role-badge { 
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    background: #333; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.6rem; font-weight: bold; border: 1px solid #555;
}
.role-badge.admin { background: #fbbf24; color: black; border-color: #f59e0b; }
.role-badge.demon { background: #ef4444; color: white; border-color: #b91c1c; }

.data-group { margin-bottom: 15px; border-bottom: 1px solid #111; padding-bottom: 5px; }
.data-group label { font-size: 0.7rem; color: #666; display: block; margin-bottom: 2px; }
.val { font-family: 'Courier New'; color: #ccc; }
.highlight { color: white; font-weight: bold; font-size: 1.1rem; }

/* CYBER STATS STYLE */
.cyber-stats { background: #050a14; border: 1px solid #1e293b; padding: 15px; border-radius: 5px; margin-top: 20px; }
.stat-line { display: flex; justify-content: space-between; font-size: 0.7rem; color: #888; margin-bottom: 10px; border-bottom: 1px dashed #333; padding-bottom: 5px; }
.stat-val { color: var(--accent); font-family: 'Courier New'; }

.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.mini-stat { background: #0f172a; padding: 8px; border-radius: 4px; text-align: center; border: 1px solid #1e293b; }
.mini-stat .label { font-size: 0.6rem; color: #666; }
.mini-stat .num { font-family: 'Press Start 2P'; font-size: 0.7rem; margin-top: 5px; color: white; }
.text-gold { color: #fbbf24 !important; }

.progress-bar { height: 4px; background: #333; border-radius: 2px; margin: 10px 0 5px 0; overflow: hidden; }
.fill { height: 100%; background: var(--success); box-shadow: 0 0 5px var(--success); }

.api-box { display: flex; gap: 10px; align-items: center; background: #000; padding: 15px; border: 1px solid var(--accent); border-radius: 4px; }
.key-display { flex: 1; font-family: 'Courier New'; font-size: 1rem; color: var(--accent); letter-spacing: 1px; word-break: break-all; }
</style>
