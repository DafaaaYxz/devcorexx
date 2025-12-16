<template>
  <div class="container slide-in" style="text-align:center; padding-top:60px;">
    <h1 class="retro-font" style="font-size:1.8rem; color:var(--primary); margin-bottom:20px;">DevCORE SYSTEM</h1>
    <p style="color:var(--text-dim); max-width:600px; margin:0 auto 40px auto; line-height:1.6;">
      Advanced Artificial Intelligence Interface designed for Cyber Operations and Development.
      Secure. Unrestricted. Powerful.
    </p>
    <div style="display:flex; justify-content:center; gap:20px;">
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login" class="btn">LOGIN SYSTEM</router-link>
        <router-link to="/about" class="btn" style="background:transparent;">ABOUT</router-link>
      </template>
      <router-link v-else to="/terminal" class="btn">OPEN TERMINAL</router-link>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '../stores/authStore';
const authStore = useAuthStore();
</script>
