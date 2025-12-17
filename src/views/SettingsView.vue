<template>
  <div class="container slide-in">
    <h1 class="retro-font text-center" style="margin-bottom:30px; color:var(--primary); text-shadow: 0 0 10px var(--primary);">SYSTEM CONFIG</h1>
    
    <div class="settings-grid">
        
        <!-- VISUAL -->
        <div class="card settings-card">
            <h3 class="retro-font section-title"><i class="fas fa-eye"></i> VISUAL INTERFACE</h3>
            <div class="setting-item">
                <label>TERMINAL FONT</label>
                <div class="select-wrapper">
                    <select v-model="settings.font" @change="saveSettings" class="input-field custom-select">
                        <option value="Roboto">Standard (Roboto)</option>
                        <option value="Press Start 2P">Retro (Pixel)</option>
                        <option value="Fira Code">Coder (Fira Code)</option>
                        <option value="Hack">Hacker (Monospace)</option>
                    </select>
                    <i class="fas fa-chevron-down select-icon"></i>
                </div>
            </div>
        </div>

        <!-- AUTH SSEO (PERBAIKAN UI) -->
        <div class="card settings-card">
            <h3 class="retro-font section-title"><i class="fas fa-shield-alt"></i> SECURE LOGIN (SSEO)</h3>
            
            <div class="setting-item">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <label style="margin:0;">ENABLE SSEO (PASSKEY)</label>
                    <div class="toggle-switch" @click="toggleSSEO" :class="{ 'active': settings.sseoEnabled }">
                        <div class="toggle-knob"></div>
                    </div>
                </div>
                <div class="status-text" :class="settings.sseoEnabled ? 'text-success' : 'text-dim'">
                    STATUS: {{ settings.sseoEnabled ? 'ACTIVE' : 'DISABLED' }}
                </div>
            </div>
            
            <div class="setting-item" v-if="settings.sseoEnabled">
                <label>ACCESS CODE (6 DIGIT)</label>
                
                <!-- PERBAIKAN LAYOUT INPUT KECIL -->
                <div class="code-wrapper">
                    <input v-model="settings.sseoCode" class="input-code" maxlength="6" placeholder="******">
                    <button @click="saveSettings" class="btn-save" title="Save">
                        <i class="fas fa-save"></i>
                    </button>
                </div>
                
                <small style="color:#666; display:block; margin-top:5px;">
                    Code used for passwordless login.
                </small>
            </div>
        </div>

        <!-- 2-FACTOR AUTH (REALTIME FIX) -->
        <div class="card settings-card">
            <h3 class="retro-font section-title"><i class="fas fa-qrcode"></i> 2-FACTOR AUTH</h3>
            
            <div class="qr-container">
                <!-- Cek Langsung ke Auth Store User -->
                <div v-if="auth.user?.twoFactorSecret" class="qr-box">
                    <img 
                        :src="getQrUrl(auth.user.username, auth.user.twoFactorSecret)" 
                        class="qr-img"
                        alt="QR Code"
                    >
                    <div class="secret-key">
                        KEY: <span style="color:var(--accent); user-select:all;">{{ auth.user.twoFactorSecret }}</span>
                    </div>
                </div>
                <div v-else class="loading-msg">
                    <i class="fas fa-circle-notch fa-spin"></i> Generating Security Key...
                </div>
            </div>
            
            <p style="font-size:0.8rem; color:#888; margin-top:15px; text-align:center;">
                Scan with Google Authenticator.
            </p>
        </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const auth = useAuthStore();
const settings = reactive({
    font: 'Roboto',
    sseoEnabled: false,
    sseoCode: ''
});
const API = 'https://devcorexx-api.vercel.app/api';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const getQrUrl = (user, secret) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/DevCORE:${user}?secret=${secret}&issuer=DevCORE`;
};

const loadSettings = () => {
    if(auth.user) {
        settings.font = auth.user.fontPreference || 'Roboto';
        settings.sseoEnabled = auth.user.sseoEnabled || false;
        settings.sseoCode = auth.user.sseoCode || '';
    }
};

const toggleSSEO = () => {
    settings.sseoEnabled = !settings.sseoEnabled;
    saveSettings(true); // Silent save
};

const saveSettings = async (silent = false) => {
    try {
        await axios.post(`${API}/auth/settings`, {
            font: settings.font,
            sseoEnabled: settings.sseoEnabled,
            sseoCodeNew: settings.sseoCode
        }, headers);
        
        await auth.fetchProfile();
        auth.applyFont(settings.font);
        
        if(!silent) alert('Settings Saved.');
    } catch(e) { alert('Failed to save settings'); }
};

onMounted(async () => {
    await auth.fetchProfile(); // WAJIB: Ambil data terbaru dari backend (Secret Key)
    loadSettings();
});
</script>

<style scoped>
.settings-grid { display: grid; gap: 20px; max-width: 700px; margin: 0 auto; }
.section-title { 
    border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; 
    font-size: 0.8rem; color: var(--accent); display: flex; align-items: center; gap: 10px;
}

.setting-item { margin-bottom: 20px; }
.setting-item label { display: block; font-size: 0.75rem; color: #aaa; margin-bottom: 8px; font-weight: bold; }

/* CUSTOM SELECT */
.select-wrapper { position: relative; }
.custom-select { appearance: none; cursor: pointer; background: #020617; color: white; font-family: 'Roboto', sans-serif; }
.select-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: var(--accent); pointer-events: none; }

/* TOGGLE SWITCH */
.toggle-switch {
    width: 50px; height: 26px; background: #333; border-radius: 13px; position: relative; cursor: pointer; transition: 0.3s;
}
.toggle-switch.active { background: var(--success); box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
.toggle-knob {
    width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s;
}
.toggle-switch.active .toggle-knob { transform: translateX(24px); }

.status-text { font-size: 0.7rem; font-weight: bold; margin-top: 5px; font-family: 'Courier New'; }
.text-success { color: var(--success); }
.text-dim { color: #666; }

/* SSEO CODE INPUT (FIXED STYLE) */
.code-wrapper { 
    display: flex; gap: 10px; align-items: center; 
    max-width: 200px; /* Batasi lebar agar input kecil */
}
.input-code { 
    flex: 1; background: #050a14; border: 1px solid var(--accent); 
    color: var(--accent); font-family: 'Fira Code', monospace; 
    font-size: 1rem; text-align: center; padding: 8px; letter-spacing: 3px; border-radius: 4px;
    width: 100%;
}
.btn-save { 
    background: var(--primary); border: none; color: white; 
    width: 40px; height: 38px; cursor: pointer; border-radius: 4px; font-size: 1rem; 
    display: flex; align-items: center; justify-content: center;
}
.btn-save:hover { background: var(--accent); }

/* QR CODE */
.qr-container { display: flex; justify-content: center; min-height: 150px; align-items: center; }
.qr-box { 
    text-align: center; background: white; padding: 15px; 
    border-radius: 8px; width: fit-content; 
    box-shadow: 0 0 20px rgba(255,255,255,0.1);
}
.qr-img { width: 150px; height: 150px; display: block; margin: 0 auto; }
.secret-key { 
    margin-top: 15px; font-family: 'Courier New'; font-size: 0.85rem; 
    background: #000; color: white; padding: 8px; border-radius: 4px; 
    display: inline-block; width: 100%; word-break: break-all;
}
.loading-msg { color: var(--accent); font-family: 'Press Start 2P'; font-size: 0.6rem; animation: pulse 1s infinite; }
@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
</style>
