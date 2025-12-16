<template>
  <div class="card">
    <h3 class="retro-font" style="color:var(--primary); margin-bottom:20px;">GLOBAL SYSTEM CONTROL</h3>
    
    <div class="control-box">
        <div class="info">
            <div class="label retro-font">MAINTENANCE MODE</div>
            <div class="desc">
                Status saat ini: 
                <span :class="maintenance ? 'status-on' : 'status-off'">
                    {{ maintenance ? 'ACTIVE (SYSTEM LOCKED)' : 'INACTIVE (SYSTEM ONLINE)' }}
                </span>
                <br>
                <small style="color:#666">Jika aktif, hanya Admin yang bisa login.</small>
            </div>
        </div>

        <div class="action">
            <!-- Logika Tombol: Jika maintenance=true, kirim false (Disable). Jika false, kirim true (Enable) -->
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
    // Tentukan target status (Kebalikan dari status sekarang)
    const targetStatus = !props.maintenance;
    
    const msg = targetStatus 
        ? "AKTIFKAN Maintenance Mode? User biasa tidak akan bisa akses." 
        : "MATIKAN Maintenance Mode? Website akan online kembali.";
    
    if(confirm(msg)) {
        // Emit status baru ke Parent (AdminView)
        emit('toggle', targetStatus);
    }
};
</script>

<style scoped>
.control-box {
    display: flex; justify-content: space-between; align-items: center;
    background: #020617; border: 1px solid var(--border); padding: 20px;
    border-radius: 8px;
}
.label { color: white; font-size: 1rem; margin-bottom: 5px; }
.desc { font-size: 0.8rem; color: #888; line-height: 1.5; }

.status-on { color: var(--danger); font-weight: bold; text-shadow: 0 0 5px var(--danger); }
.status-off { color: var(--success); font-weight: bold; text-shadow: 0 0 5px var(--success); }

.btn-turn-on {
    background: var(--danger); color: white; border: 1px solid #ef4444; padding: 12px 20px;
    font-family: 'Press Start 2P'; font-size: 0.6rem; cursor: pointer;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); transition: 0.3s;
}
.btn-turn-on:hover { background: #b91c1c; transform: scale(1.05); }

.btn-turn-off {
    background: var(--success); color: white; border: 1px solid #10b981; padding: 12px 20px;
    font-family: 'Press Start 2P'; font-size: 0.6rem; cursor: pointer;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); transition: 0.3s;
}
.btn-turn-off:hover { background: #047857; transform: scale(1.05); }

@media (max-width: 600px) {
    .control-box { flex-direction: column; gap: 20px; text-align: center; }
    .action { width: 100%; }
    .action button { width: 100%; }
}
</style>
