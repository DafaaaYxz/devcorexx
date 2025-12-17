<template>
  <div class="container slide-in">
    <h1 class="retro-font text-center" style="margin-bottom:30px; color:var(--primary); text-shadow: 0 0 15px var(--primary);">
        <i class="fas fa-id-card"></i> USER PROFILE
    </h1>
    
    <div class="profile-grid">
        <!-- IDENTITY CARD -->
        <div class="card identity-card">
            <div class="card-header-row">
                <h3 class="retro-font section-title">IDENTITY</h3>
                <router-link to="/settings" class="btn-icon-setting"><i class="fas fa-cog"></i></router-link>
            </div>

            <div class="identity-content">
                <div class="avatar-col">
                    <img :src="auth.user?.avatarUrl" class="avatar-img" alt="Avatar">
                    <div class="role-badge" :class="auth.user?.role">{{ auth.user?.role?.toUpperCase() }}</div>
                </div>
                
                <div class="info-col">
                    <div class="data-group">
                        <label>USERNAME</label>
                        <div class="val highlight">{{ auth.user?.username }}</div>
                    </div>
                    <div class="data-group">
                        <label>STATUS</label>
                        <div class="val" :style="{color: auth.user?.isApproved ? '#10b981' : '#fbbf24'}">
                            <i class="fas" :class="auth.user?.isApproved ? 'fa-check-circle' : 'fa-clock'"></i>
                            {{ auth.user?.isApproved ? 'APPROVED' : 'PENDING' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- LIMIT COUNTER (User Free) -->
            <div v-if="!auth.user?.isApproved && auth.user?.role !== 'admin'" class="limit-bar-wrapper">
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; margin-bottom:5px;">
                    <span>FREE LIMIT</span>
                    <span class="text-gold">{{ auth.user?.promptCount || 0 }} / 100</span>
                </div>
                <div class="progress-bg"><div class="progress-fill" :style="{width: (auth.user?.promptCount || 0) + '%'}"></div></div>
            </div>

            <!-- STATS GRID -->
            <div class="cyber-stats">
                <div class="stat-item">
                    <div class="label">LAST LOGIN</div>
                    <div class="value">{{ formatDate(auth.user?.lastLogin) }}</div>
                </div>
                <div class="stat-row">
                    <div class="mini-stat">
                        <div class="num">{{ auth.user?.apiReqCount || 0 }}</div>
                        <div class="lbl">REQUESTS</div>
                    </div>
                    <div class="mini-stat">
                        <div class="num text-gold">{{ auth.user?.tokenUsage || 0 }}</div>
                        <div class="lbl">TOKENS</div>
                    </div>
                    <div class="mini-stat">
                        <div class="num" style="color:#f472b6;">{{ auth.user?.healthStatus || '100%' }}</div>
                        <div class="lbl">HEALTH</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECURITY & API -->
        <div class="side-col">
            <!-- SECURITY -->
            <div class="card">
                <h3 class="retro-font section-title">SECURITY</h3>
                <form @submit.prevent="changePass">
                    <div class="input-wrapper">
                        <i class="fas fa-lock input-icon"></i>
                        <input v-model="pass.old" type="password" class="input-field pl-40" placeholder="OLD PASSWORD" required>
                    </div>
                    <div class="input-wrapper">
                        <i class="fas fa-key input-icon"></i>
                        <input v-model="pass.new" type="password" class="input-field pl-40" placeholder="NEW PASSWORD" required>
                    </div>
                    <button type="submit" class="btn w-full">UPDATE</button>
                </form>
            </div>

            <!-- API KEY -->
            <div class="card">
                <h3 class="retro-font section-title">API KEY</h3>
                <p style="font-size:0.8rem; color:#888; margin-bottom:15px;">
                    For cURL / External Apps.
                </p>
                <div class="api-box">
                    <div class="key-display">{{ auth.user?.personalApiKey || 'NOT GENERATED' }}</div>
                    <button @click="generateKey" class="btn-refresh"><i class="fas fa-sync"></i></button>
                </div>
                <router-link to="/docs" class="docs-link">View Documentation <i class="fas fa-arrow-right"></i></router-link>
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
const API = 'https://devcorexx-api.vercel.app/api';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const formatDate = (dateString) => {
    if(!dateString) return 'NEVER';
    return new Date(dateString).toLocaleString('id-ID', { hour12: false });
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
.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }

.card-header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
.section-title { font-size: 0.8rem; color: #fff; margin: 0; }
.btn-icon-setting { color: #666; font-size: 1.2rem; transition: 0.3s; }
.btn-icon-setting:hover { color: var(--accent); transform: rotate(90deg); }

/* IDENTITY SECTION */
.identity-content { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
.avatar-col { position: relative; width: 80px; }
.avatar-img { width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--primary); background: #000; }
.role-badge { 
    position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
    background: #333; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: bold; border: 1px solid #555; white-space: nowrap;
}
.role-badge.admin { background: #fbbf24; color: black; }
.role-badge.demon { background: #ef4444; color: white; }

.info-col { flex: 1; }
.data-group { margin-bottom: 10px; }
.data-group label { font-size: 0.65rem; color: #666; display: block; }
.val { font-family: 'Roboto', sans-serif; font-weight: bold; color: #ddd; }
.highlight { font-size: 1.1rem; color: white; }

/* LIMIT BAR */
.limit-bar-wrapper { margin: 15px 0; background: #050a14; padding: 10px; border-radius: 5px; border: 1px solid #333; }
.progress-bg { height: 6px; background: #333; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #ef4444); }

/* STATS */
.cyber-stats { background: #020617; border: 1px solid #1e293b; padding: 15px; border-radius: 5px; margin-top: 20px; }
.stat-item { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 10px; }
.stat-item .label { font-size: 0.7rem; color: #666; }
.stat-item .value { font-family: 'Fira Code', monospace; color: var(--accent); font-size: 0.9rem; }

.stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; text-align: center; }
.mini-stat { background: #0f172a; padding: 8px; border-radius: 4px; border: 1px solid #333; }
.mini-stat .num { font-family: 'Press Start 2P'; font-size: 0.7rem; color: white; margin-bottom: 5px; }
.mini-stat .lbl { font-size: 0.55rem; color: #666; }
.text-gold { color: #fbbf24 !important; }

/* INPUTS */
.input-wrapper { position: relative; margin-bottom: 10px; }
.input-icon { position: absolute; left: 12px; top: 12px; color: #666; font-size: 0.9rem; }
.pl-40 { padding-left: 35px; }

/* API KEY */
.api-box { display: flex; gap: 5px; background: #000; padding: 10px; border: 1px solid var(--accent); border-radius: 4px; margin-bottom: 10px; }
.key-display { flex: 1; font-family: 'Fira Code'; font-size: 0.8rem; color: var(--accent); overflow: hidden; text-overflow: ellipsis; }
.btn-refresh { background: var(--primary); border: none; color: white; width: 30px; border-radius: 3px; cursor: pointer; }
.docs-link { font-size: 0.8rem; color: #666; display: block; text-align: right; }
.docs-link:hover { color: var(--accent); }
</style>
