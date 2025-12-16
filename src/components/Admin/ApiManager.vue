<template>
  <div class="card">
    <h3 class="retro-font" style="color:var(--primary); margin-bottom:15px;">API KEYS</h3>
    
    <div class="add-container">
      <input v-model="newKey" placeholder="Paste OpenRouter Key (sk-or-v1...)" class="input-field" style="margin:0">
      <button @click="handleAdd" class="btn">ADD KEY</button>
    </div>

    <div class="key-list">
        <div v-for="k in keys" :key="k._id" class="key-item">
            <div class="key-info">
                <i class="fas fa-key" style="color:var(--accent); margin-right:8px;"></i>
                <span class="key-code">{{ k.key.substring(0, 12) }}...{{ k.key.substring(k.key.length - 4) }}</span>
                <span class="provider-tag">OPENROUTER</span>
            </div>
            <button @click="$emit('delete', k._id)" class="btn-del"><i class="fas fa-trash"></i></button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['keys']);
const emit = defineEmits(['add', 'delete']);
const newKey = ref('');

const handleAdd = () => {
    if(!newKey.value) return alert('Key cannot be empty');
    emit('add', { key: newKey.value });
    newKey.value = '';
};
</script>

<style scoped>
.add-container { display: flex; gap: 10px; margin-bottom: 20px; }
.key-item { 
    background: #020617; border: 1px solid var(--border);
    padding: 10px 15px; margin-bottom: 8px;
    display: flex; justify-content: space-between; align-items: center;
}
.key-code { font-family: 'Courier New', monospace; font-size: 0.8rem; color: #cbd5e1; margin-right: 10px; }
.provider-tag { font-size: 0.6rem; background: #1e293b; padding: 2px 5px; border-radius: 3px; color: #94a3b8; }
.btn-del { background: transparent; border: none; color: var(--danger); cursor: pointer; padding: 5px; }
.btn-del:hover { color: #fca5a5; }
</style>
