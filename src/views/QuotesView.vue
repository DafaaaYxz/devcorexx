<template>
  <div class="container slide-in">
    <h2 class="retro-font text-center" style="margin-bottom:30px;">SYSTEM QUOTES</h2>
    <div class="quote-grid">
      <div v-for="q in quotes" :key="q._id" class="card quote-box">
        <p>"{{ q.content }}"</p>
        <div class="retro-font author">- {{ q.author }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const quotes = ref([]);
onMounted(async () => {
  const res = await axios.get('http://146.190.98.149:5000/api/admin/quotes');
  quotes.value = res.data;
});
</script>
<style scoped>
.quote-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.quote-box { border-left: 4px solid var(--accent); }
.author { font-size: 0.6rem; color: var(--accent); margin-top: 15px; text-align: right; }
</style>
