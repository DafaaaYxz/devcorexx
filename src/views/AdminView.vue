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

    <!-- Components -->
    <UserManager v-if="tab==='users'" :users="users" @approve="toggleApprove" @changeRole="handleChangeRole" />
    <ApiManager v-if="tab==='api'" :keys="config.apiKeys || []" @add="addApiKey" @delete="delApiKey" />
    <QuotesManager v-if="tab==='quotes'" :quotes="quotes" @add="addQuote" @delete="delQuote" />
    <SystemControl v-if="tab==='system'" :maintenance="config.maintenanceMode" @toggle="handleMaintenance" />

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
const API = 'https://wanzofc-dev.vercel.app/api/admin';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };

const loadData = async () => {
  try {
      users.value = (await axios.get(`${API}/users`, headers)).data;
      const configRes = await axios.get(`${API}/config`, headers);
      config.value = configRes.data;
      quotes.value = (await axios.get(`${API}/quotes`, headers)).data;
  } catch (e) { alert('Error Loading Data'); }
};

const toggleApprove = async (id, status) => { await axios.post(`${API}/approve`, { userId: id, approve: status }, headers); loadData(); };
const handleChangeRole = async (id, newRole) => { 
    if(!confirm(`Change user role to ${newRole}?`)) return;
    await axios.post(`${API}/role`, { userId: id, newRole }, headers); 
    loadData(); 
};

const addApiKey = async (data) => { await axios.post(`${API}/apikey`, data, headers); loadData(); };
const delApiKey = async (id) => { await axios.delete(`${API}/apikey/${id}`, headers); loadData(); };
const addQuote = async (data) => { await axios.post(`${API}/quotes`, data, headers); loadData(); };
const delQuote = async (id) => { await axios.delete(`${API}/quotes/${id}`, headers); loadData(); };
const handleMaintenance = async (status) => {
    try {
        await axios.post(`${API}/maintenance`, { enabled: status }, headers);
        config.value.maintenanceMode = status;
        alert(`System Maintenance: ${status ? 'ON' : 'OFF'}`);
    } catch(e) { alert('Failed'); }
};

onMounted(loadData);
</script>

<style scoped>
.header-box { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.btn.active { background-color: var(--accent); color: white; border-color: white; }
</style>
