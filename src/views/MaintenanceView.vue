<template>
  <div class="maint-container">
    <div class="maint-card">
      <i class="fas fa-tools fa-3x" style="color:var(--danger); margin-bottom:20px;"></i>
      <h1 class="retro-font blink text-danger">SYSTEM MAINTENANCE</h1>
      <p>DevCORE is currently undergoing critical upgrades.</p>
      <div class="lock-info">
        <i class="fas fa-lock"></i> ACCESS RESTRICTED TO ADMINS
      </div>
      <button v-if="auth.isAdmin" @click="$router.push('/terminal')" class="btn">ADMIN OVERRIDE</button>
      <button v-else @click="checkStatus" class="btn">CHECK STATUS</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';
import { useRouter } from 'vue-router';
const auth = useAuthStore();
const router = useRouter();

const checkStatus = async () => {
    try {
        const res = await axios.get('https://wanzofc-dev.vercel.app/api/system/config'); // Pastikan route public ini ada/dibuat
        if(!res.data.maintenance) router.push('/');
        else alert('System is still in maintenance.');
    } catch(e) { alert('System Offline.'); }
};
</script>

<style scoped>
.maint-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; }
.maint-card { border: 2px solid var(--danger); padding: 40px; text-align: center; max-width: 500px; background: #110000; }
.text-danger { color: var(--danger); font-size: 1.5rem; margin-bottom: 20px; }
.lock-info { margin: 30px 0; font-family: 'Courier New'; color: #888; border: 1px dashed #444; padding: 10px; }
.blink { animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
