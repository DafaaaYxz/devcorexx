<template>
  <div class="card">
    <h3 class="retro-font" style="color:var(--primary); margin-bottom:15px;">SYSTEM QUOTES</h3>
    
    <!-- Form Tambah Quote -->
    <div class="add-box">
      <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
        <textarea v-model="form.content" placeholder="Enter Quote..." class="input-field" rows="2"></textarea>
        <div style="display:flex; gap:10px;">
            <input v-model="form.author" placeholder="Author (e.g. Linus Torvalds)" class="input-field" style="margin:0;">
            <button @click="handleAdd" class="btn">POST</button>
        </div>
      </div>
    </div>

    <!-- List Quotes -->
    <div class="quote-list">
        <div v-for="q in quotes" :key="q._id" class="quote-item">
            <div>
                <div class="q-content">"{{ q.content }}"</div>
                <div class="q-author">- {{ q.author }}</div>
            </div>
            <button @click="$emit('delete', q._id)" class="btn-del"><i class="fas fa-trash"></i></button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const props = defineProps(['quotes']);
const emit = defineEmits(['add', 'delete']);
const form = reactive({ content: '', author: '' });

const handleAdd = () => {
    if(!form.content) return alert('Quote content required');
    emit('add', { ...form });
    form.content = '';
    form.author = '';
};
</script>

<style scoped>
.add-box { margin-bottom: 20px; background: #020617; padding: 15px; border: 1px solid var(--border); }
.quote-item { 
    background: #020617; border-left: 3px solid var(--accent);
    padding: 10px 15px; margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center;
}
.q-content { font-style: italic; color: #e2e8f0; font-size: 0.9rem; margin-bottom: 5px; }
.q-author { font-size: 0.7rem; color: var(--accent); font-family: 'Press Start 2P'; }
.btn-del { background: transparent; border: none; color: var(--danger); cursor: pointer; }
</style>
