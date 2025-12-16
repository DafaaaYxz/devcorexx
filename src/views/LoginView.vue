<template>
  <div class="container" style="display:flex; align-items:center; justify-content:center; height:80vh;">
    <div class="card slide-in" style="width:100%; max-width:400px;">
      <h2 class="retro-font text-center" style="margin-bottom:20px;">ACCESS CONTROL</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="form.username" placeholder="Username" class="input-field" required>
        <input v-model="form.password" type="password" placeholder="Password" class="input-field" required>
        <button type="submit" class="btn w-full">AUTHENTICATE</button>
      </form>
      <div style="text-align:center; margin-top:20px; font-size:0.8rem;">
        <router-link to="/register" style="color:var(--accent)">Request Clearance (Register)</router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
const auth = useAuthStore();
const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = async () => {
  try {
    await auth.login(form);
    // REDIRECT KE PROFILE SESUAI REQUEST
    router.push('/profile');
  } catch(e) {
    alert('ACCESS DENIED: Invalid Credentials or Server Error');
  }
};
</script>
