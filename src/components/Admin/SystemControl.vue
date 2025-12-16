<template>
  <div class="card">
    <h3 class="retro-font" style="color:var(--primary); margin-bottom:20px;">GLOBAL SYSTEM CONTROL</h3>
    
    <div class="control-box">
        <div class="info">
            <div class="label retro-font">MAINTENANCE MODE</div>
            <div class="desc">
                When active, all non-admin users will be locked out.
                <br>
                Current Status: 
                <span :class="maintenance ? 'status-on' : 'status-off'">
                    {{ maintenance ? 'ACTIVE (LOCKED)' : 'INACTIVE (NORMAL)' }}
                </span>
            </div>
        </div>

        <div class="action">
            <button 
                @click="toggleMaintenance" 
                :class="maintenance ? 'btn-turn-off' : 'btn-turn-on'"
            >
                <i class="fas" :class="maintenance ? 'fa-unlock' : 'fa-lock'"></i>
                {{ maintenance ? 'DISABLE MAINTENANCE' : 'ENABLE MAINTENANCE' }}
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['maintenance']);
const emit = defineEmits(['toggle']);

const toggleMaintenance = () => {
    const msg = props.maintenance 
        ? "Turn OFF Maintenance Mode? Users will be able to login." 
        : "Turn ON Maintenance Mode? Non-admin users will be kicked out.";
    
    if(confirm(msg)) {
        emit('toggle', !props.maintenance);
    }
};
</script>

<style scoped>
.control-box {
    display: flex; justify-content: space-between; align-items: center;
    background: #020617; border: 1px solid var(--border); padding: 20px;
}
.label { color: white; font-size: 1rem; margin-bottom: 5px; }
.desc { font-size: 0.8rem; color: #888; line-height: 1.5; }

.status-on { color: var(--danger); font-weight: bold; text-shadow: 0 0 5px var(--danger); }
.status-off { color: var(--success); font-weight: bold; }

.btn-turn-on {
    background: var(--danger); color: white; border: none; padding: 15px 20px;
    font-family: 'Press Start 2P'; font-size: 0.7rem; cursor: pointer;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}
.btn-turn-on:hover { background: #b91c1c; }

.btn-turn-off {
    background: var(--success); color: white; border: none; padding: 15px 20px;
    font-family: 'Press Start 2P'; font-size: 0.7rem; cursor: pointer;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}
.btn-turn-off:hover { background: #047857; }

@media (max-width: 600px) {
    .control-box { flex-direction: column; gap: 20px; text-align: center; }
    .action { width: 100%; }
    .action button { width: 100%; }
}
</style>
