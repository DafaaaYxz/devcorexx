<template>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3 class="retro-font" style="color:var(--primary);">USER MANAGEMENT</h3>
        <small style="color:#666">{{ users.length }} Users</small>
    </div>
    
    <div v-for="u in users" :key="u._id" class="user-row">
      <div class="info-col">
        <div class="retro-font u-name">{{ u.username }}</div>
        <div class="u-meta">
            AI: {{ u.reqAiName }} | Dev: {{ u.reqDevName }}
        </div>
        <!-- ROLE SELECTOR -->
        <div class="role-selector">
            <span class="label">ROLE:</span>
            <select :value="u.role" @change="$emit('changeRole', u._id, $event.target.value)" class="role-input">
                <option value="user">USER</option>
                <option value="premium">PREMIUM</option>
                <option value="demon">DEMON</option>
                <option value="admin">ADMIN</option>
            </select>
        </div>
      </div>
      
      <div class="action-col">
        <div class="status-badge" :class="u.isApproved ? 'status-ok' : 'status-wait'">
            {{ u.isApproved ? 'ACTIVE' : 'WAITING' }}
        </div>
        <button v-if="!u.isApproved" @click="$emit('approve', u._id, true)" class="btn btn-approve">
            <i class="fas fa-check"></i>
        </button>
        <button v-else @click="$emit('approve', u._id, false)" class="btn btn-reject">
            <i class="fas fa-ban"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['users']);
defineEmits(['approve', 'changeRole']);
</script>

<style scoped>
.user-row {
    background: #050a14; border: 1px solid var(--border); padding: 15px; margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center;
}
.u-name { color: white; font-size: 0.9rem; margin-bottom: 5px; }
.u-meta { font-size: 0.75rem; color: #94a3b8; }
.role-selector { margin-top: 5px; font-size: 0.7rem; color: #666; }
.role-input { background: #111; color: white; border: 1px solid #333; padding: 2px; margin-left: 5px; font-size: 0.7rem; }

.status-badge { font-size: 0.6rem; font-weight: bold; padding: 2px 6px; border-radius: 3px; text-align: center; margin-bottom: 5px; }
.status-ok { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.status-wait { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

.action-col { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.btn-approve { background: #064e3b; border: 1px solid #059669; color: #a7f3d0; padding: 5px 10px; font-size: 0.7rem; }
.btn-reject { background: #7f1d1d; border: 1px solid #dc2626; color: #fca5a5; padding: 5px 10px; font-size: 0.7rem; }
</style>
