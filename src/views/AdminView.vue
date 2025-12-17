<template>
  <div class="container slide-in">
    <div class="header-box">
        <h1 class="retro-font">ADMIN DASHBOARD</h1>
        <div class="tabs">
            <button @click="tab='users'" :class="['btn', tab==='users'?'active':'']">USERS</button>
            <button @click="tab='api'" :class="['btn', tab==='api'?'active':'']">API KEYS</button>
            <button @click="tab='quotes'" :class="['btn', tab==='quotes'?'active':'']">QUOTES</button>
            <button @click="tab='system'" :class="['btn', tab==='system'?'active':'']" style="border-color:var(--danger); color:var(--danger)">SYSTEM</button>
        </div>
    </div>

    <!-- Load Components -->
    <UserManager v-if="tab==='users'" :users="users" @approve="toggleApprove" @changeRole="handleChangeRole" />
    <ApiManager v-if="tab==='api'" :keys="config.apiKeys || []" @add="addApiKey" @delete="delApiKey" />
    <QuotesManager v-if="tab==='quotes'" :quotes="quotes" @add="addQuote" @delete="delQuote" />
    
    <!-- System Control dengan Props Maintenance yang reaktif -->
    <SystemControl 
        v-if="tab==='system'" 
        :maintenance="config.maintenanceMode" 
        @toggle="handleMaintenance" 
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import UserManager from '../components/Admin/UserManager.vue';
import ApiManager from '../components/Admin/ApiManager.vue';
import QuotesManager from '../components/Admin/QuotesManager.vue';
import SystemControl from '../components/Admin/SystemControl.vue';

const auth = useAuthStore();
const tab = ref('users');
const users = ref([]);
const quotes = ref([]);
const config = ref({ maintenanceMode: false, apiKeys: [] });
const API = 'https://devcorexx-api.vercel.app/api/admin';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const loadData = async () => {
  try {
      // Load Users
      const uRes = await axios.get(`${API}/users`, headers);
      users.value = uRes.data;
      
      // Load Config (Penting untuk Status Maintenance)
      const cRes = await axios.get(`${API}/config`, headers);
      config.value = cRes.data;
      
      // Load Quotes
      const qRes = await axios.get(`${API}/quotes`, headers);
      quotes.value = qRes.data;
  } catch (e) { alert('Error Loading Data'); }
};

// Actions User
const toggleApprove = async (id, status) => { await axios.post(`${API}/approve`, { userId: id, approve: status }, headers); loadData(); };
const handleChangeRole = async (id, newRole) => { 
    if(!confirm(`Change role to ${newRole}?`)) return;
    await axios.post(`${API}/role`, { userId: id, newRole }, headers); 
    loadData(); 
};

// Actions API & Quotes
const addApiKey = async (data) => { await axios.post(`${API}/apikey`, data, headers); loadData(); };
const delApiKey = async (id) => { await axios.delete(`${API}/apikey/${id}`, headers); loadData(); };
const addQuote = async (data) => { await axios.post(`${API}/quotes`, data, headers); loadData(); };
const delQuote = async (id) => { await axios.delete(`${API}/quotes/${id}`, headers); loadData(); };

// LOGIKA MAINTENANCE (FIXED)
const handleMaintenance = async (newStatus) => {
    try {
        // Kirim status baru ke server (true/false)
        const res = await axios.post(`${API}/maintenance`, { enabled: newStatus }, headers);
        
        // Update local state langsung dari respons server agar UI berubah
        config.value.maintenanceMode = res.data.maintenanceMode;
        
        alert(res.data.message); // Tampilkan alert sukses dari server
    } catch(e) {
        alert('Failed to update maintenance mode');
        loadData(); // Reload data asli jika gagal
    }
};

onMounted(loadData);
</script>

<style scoped>
.header-box { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.btn.active { background-color: var(--accent); color: white; border-color: white; }
</style>
