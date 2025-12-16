<template>
  <div v-if="loading" class="boot-screen">
    <div class="boot-box">
      <h1 class="retro-font blink" style="color:var(--primary)">SYSTEM BOOT</h1>
      <div class="terminal-lines">
        <div v-for="(line, i) in lines" :key="i">
          <span style="color:#10b981">[OK]</span> {{ line }}
        </div>
      </div>
      <div class="progress-bar"><div class="fill" :style="{width: progress+'%'}"></div></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useConfigStore } from '../stores/configStore';
const config = useConfigStore();
const loading = ref(true);
const progress = ref(0);
const lines = ref([]);
const texts = ["Mounting Root FS...", "Loading Kernel Modules...", "Initializing AI Core...", "Connecting to Uplink...", "Secure Shell Ready."];

onMounted(() => {
  let i = 0;
  const interval = setInterval(() => {
    if (i < texts.length) { lines.value.push(texts[i]); i++; progress.value += 20; }
    else { 
      clearInterval(interval); 
      setTimeout(() => { loading.value = false; config.setBootComplete(); }, 600); 
    }
  }, 350);
});
</script>
<style scoped>
.boot-screen { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; justify-content: center; align-items: center; }
.boot-box { width: 90%; max-width: 400px; text-align: center; }
.terminal-lines { text-align: left; font-family: 'Courier New'; color: #0f0; margin: 20px 0; font-size: 0.8rem; height: 100px; }
.progress-bar { height: 8px; background: #333; border: 1px solid var(--primary); }
.fill { height: 100%; background: var(--primary); transition: width 0.3s; }
.blink { animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
