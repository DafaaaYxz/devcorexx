<template>
  <div class="container slide-in">
    <div class="demon-header">
        <h1 class="retro-font text-demon"><i class="fas fa-skull"></i> DEMON DASHBOARD</h1>
        <p class="subtitle">UNRESTRICTED ACCESS LEVEL 99</p>
    </div>

    <!-- TERMINAL LOG OUTPUT -->
    <div class="log-console">
        <div class="log-header">SYSTEM.LOG</div>
        <div class="log-body" ref="logBody">
            <div v-for="(log, i) in logs" :key="i" class="log-line">
                <span class="timestamp">[{{ new Date().toLocaleTimeString() }}]</span>
                <span class="cmd">></span> {{ log }}
            </div>
        </div>
    </div>

    <!-- FEATURE GRID -->
    <div class="hack-grid">
        <!-- 1. STEAL TOKEN -->
        <div class="hack-card">
            <h3>1. STEAL TOKEN</h3>
            <input v-model="inputs.targetToken" placeholder="Target Username" class="demon-input">
            <input v-model="inputs.amountToken" placeholder="Amount" type="number" class="demon-input">
            <button @click="exec('steal-token', {targetName: inputs.targetToken, amount: inputs.amountToken})" class="btn-demon">EXECUTE</button>
        </div>

        <!-- 2. BAN USER -->
        <div class="hack-card">
            <h3>2. BAN PREMIUM (-10 HP)</h3>
            <input v-model="inputs.targetBan" placeholder="Target Username" class="demon-input">
            <button @click="exec('ban-user', {targetName: inputs.targetBan})" class="btn-demon">EXECUTE</button>
        </div>

        <!-- 3. STEAL LIMIT -->
        <div class="hack-card">
            <h3>3. STEAL LIMIT</h3>
            <input v-model="inputs.targetLimit" placeholder="Target Username" class="demon-input">
            <button @click="exec('steal-limit', {targetName: inputs.targetLimit})" class="btn-demon">EXECUTE</button>
        </div>

        <!-- 4. IP LOGGER -->
        <div class="hack-card">
            <h3>4. IP LOGGER</h3>
            <input v-model="inputs.targetIp" placeholder="Target Username" class="demon-input">
            <button @click="exec('ip-logger', {targetName: inputs.targetIp})" class="btn-demon">TRACE</button>
        </div>

        <!-- 5. FORCE LOGOUT -->
        <div class="hack-card">
            <h3>5. FORCE LOGOUT</h3>
            <input v-model="inputs.targetKick" placeholder="Target Username" class="demon-input">
            <button @click="exec('force-logout', {targetName: inputs.targetKick})" class="btn-demon">KICK</button>
        </div>

        <!-- 6. BYPASS MAINT -->
        <div class="hack-card">
            <h3>6. BYPASS MAINTENANCE</h3>
            <div class="info-text">Automatic Bypass Active</div>
            <button @click="exec('bypass-check', {})" class="btn-demon">CHECK STATUS</button>
        </div>

        <!-- 7. VIEW HISTORY -->
        <div class="hack-card">
            <h3>7. SPY CHAT</h3>
            <input v-model="inputs.targetSpy" placeholder="Target Username" class="demon-input">
            <button @click="exec('view-chat', {targetName: inputs.targetSpy})" class="btn-demon">SPY</button>
        </div>

        <!-- 8. INJECT PROMPT -->
        <div class="hack-card">
            <h3>8. INJECT PROMPT</h3>
            <input v-model="inputs.targetInject" placeholder="Target Username" class="demon-input">
            <input v-model="inputs.prompt" placeholder="New System Prompt" class="demon-input">
            <button @click="exec('inject-prompt', {targetName: inputs.targetInject, prompt: inputs.prompt})" class="btn-demon">INJECT</button>
        </div>

        <!-- 9. PRIORITY -->
        <div class="hack-card">
            <h3>9. PRIORITY QUEUE</h3>
            <input v-model="inputs.targetPrio" placeholder="Target Username" class="demon-input">
            <button @click="exec('priority', {targetName: inputs.targetPrio})" class="btn-demon">BOOST</button>
        </div>

        <!-- 10. INVISIBLE -->
        <div class="hack-card">
            <h3>10. INVISIBLE MODE</h3>
            <div class="info-text">Hide online status</div>
            <button @click="exec('invisible', {})" class="btn-demon">TOGGLE</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
const logs = ref(['DEMON PANEL INITIALIZED...', 'READY FOR EXPLOITS.']);
const logBody = ref(null);
const API = 'https://wanzofc-dev.vercel.app/api/demon';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const inputs = reactive({
    targetToken: '', amountToken: '',
    targetBan: '',
    targetLimit: '',
    targetIp: '',
    targetKick: '',
    targetSpy: '',
    targetInject: '', prompt: '',
    targetPrio: ''
});

const exec = async (endpoint, data) => {
    logs.value.push(`Executing ${endpoint.toUpperCase()}...`);
    try {
        const res = await axios.post(`${API}/${endpoint}`, data, headers);
        if(endpoint === 'bypass-check') { // GET method for this one
             // bypass-check is get but let's use post for uniformity in exec function or adjust
             // Update: in router it is GET. Let's fix controller to allow POST or fix call here.
             // Easier: just make the router accept POST for bypass too or handle here.
             // Fix: let's assume router accepts POST for simplicity in UI, if not error.
             // Actually, I defined router.get for bypass. Let's use axios.get if endpoint is bypass.
        }
        
        // Handle result
        const output = res.data.log || JSON.stringify(res.data);
        logs.value.push(output);
    } catch(e) {
        // Special handle for GET route if axios.post failed 404
        if(endpoint === 'bypass-check') {
             const res = await axios.get(`${API}/${endpoint}`, headers);
             logs.value.push(res.data.log);
             return;
        }
        logs.value.push(`[ERROR] ${e.response?.data?.message || e.message}`);
    }
};
</script>

<style scoped>
.demon-header { text-align: center; margin-bottom: 30px; margin-top: 20px; }
.text-demon { color: #ef4444; font-size: 2rem; text-shadow: 0 0 10px #ef4444; }
.subtitle { color: #7f1d1d; letter-spacing: 2px; font-weight: bold; }

.log-console { background: #000; border: 1px solid #ef4444; margin-bottom: 30px; font-family: 'Courier New'; height: 150px; overflow: hidden; display: flex; flex-direction: column; }
.log-header { background: #ef4444; color: black; padding: 5px 10px; font-weight: bold; font-size: 0.8rem; }
.log-body { padding: 10px; overflow-y: auto; flex: 1; color: #fca5a5; font-size: 0.8rem; }
.timestamp { color: #666; margin-right: 5px; }
.cmd { color: #ef4444; margin-right: 5px; }

.hack-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
.hack-card { background: #1a0505; border: 1px solid #7f1d1d; padding: 20px; border-radius: 5px; transition: 0.3s; }
.hack-card:hover { border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
.hack-card h3 { color: #ef4444; font-size: 0.9rem; margin-bottom: 15px; font-family: 'Press Start 2P'; line-height: 1.5; }

.demon-input { width: 100%; background: #000; border: 1px solid #7f1d1d; color: #ef4444; padding: 10px; margin-bottom: 10px; font-family: 'Courier New'; }
.demon-input:focus { border-color: #ef4444; outline: none; }

.btn-demon { width: 100%; background: #7f1d1d; color: white; border: none; padding: 10px; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.7rem; transition: 0.2s; }
.btn-demon:hover { background: #ef4444; color: black; }

.info-text { color: #555; font-style: italic; margin-bottom: 15px; font-size: 0.8rem; }
</style>
