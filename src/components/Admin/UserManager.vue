<template>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3 class="retro-font" style="color:var(--primary);">USER REQUESTS</h3>
        <small style="color:#666">{{ users.length }} Users Found</small>
    </div>
    
    <div v-if="users.length === 0" style="padding:20px; text-align:center; color:#444;">
        No pending user requests.
    </div>
    
    <div v-for="u in users" :key="u._id" class="user-row">
      <div class="info-col">
        <div class="retro-font u-name">{{ u.username }}</div>
        <div class="u-meta">
            <div><span class="label">Req AI:</span> {{ u.reqAiName }}</div>
            <div><span class="label">Req Dev:</span> {{ u.reqDevName }}</div>
        </div>
        <div class="status-badge" :class="u.isApproved ? 'status-ok' : 'status-wait'">
            {{ u.isApproved ? 'ACCESS GRANTED' : 'PENDING APPROVAL' }}
        </div>
      </div>
      
      <div class="action-col">
        <button v-if="!u.isApproved" @click="$emit('approve', u._id, true)" class="btn btn-approve">
            <i class="fas fa-check"></i> ACCEPT
        </button>
        <button v-if="u.isApproved" @click="$emit('approve', u._id, false)" class="btn btn-reject">
            <i class="fas fa-ban"></i> REVOKE
        </button>
        <button v-if="!u.isApproved" @click="$emit('approve', u._id, false)" class="btn btn-reject">
            <i class="fas fa-times"></i> REJECT
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['users']);
</script>

<style scoped>
.user-row {
    background: #050a14; border: 1px solid var(--border);
    padding: 15px; margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center;
    transition: 0.3s;
}
.user-row:hover { border-color: var(--accent); }
.u-name { color: white; font-size: 0.9rem; margin-bottom: 5px; }
.u-meta { font-size: 0.75rem; color: #94a3b8; line-height: 1.4; }
.label { color: var(--accent); }

.status-badge {
    margin-top: 8px; font-size: 0.6rem; font-weight: bold; padding: 2px 6px; border-radius: 3px; display: inline-block;
}
.status-ok { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.status-wait { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

.action-col { display: flex; gap: 8px; }
.btn-approve { background: #064e3b; border: 1px solid #059669; color: #a7f3d0; padding: 8px 12px; font-size: 0.7rem; cursor: pointer; }
.btn-reject { background: #7f1d1d; border: 1px solid #dc2626; color: #fca5a5; padding: 8px 12px; font-size: 0.7rem; cursor: pointer; }

@media (max-width: 600px) {
    .user-row { flex-direction: column; align-items: flex-start; gap: 15px; }
    .action-col { width: 100%; }
    .action-col button { flex: 1; }
}
</style>
