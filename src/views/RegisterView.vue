<template>
  <div class="container" style="display:flex; align-items:center; justify-content:center; height:80vh;">
    <div class="card slide-in" style="width:100%; max-width:450px;">
      <h2 class="retro-font text-center" style="margin-bottom:20px;">NEW IDENTITY</h2>
      <form @submit.prevent="handleReg">
        <input v-model="form.username" placeholder="Username" class="input-field" required>
        <input v-model="form.password" type="password" placeholder="Password" class="input-field" required>
        <div style="display:flex; gap:10px;">
          <input v-model="form.aiName" placeholder="Req AI Name" class="input-field">
          <input v-model="form.devName" placeholder="Req Dev Name" class="input-field">
        </div>
        <p style="font-size:0.7rem; color:#666; margin-bottom:15px;">*Pending Admin Approval</p>
        <button type="submit" class="btn w-full">SUBMIT REQUEST</button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();
const form = reactive({ username: '', password: '', aiName: '', devName: '' });

const handleReg = async () => {
  try {
    await axios.post('https://devcorexx-api.vercel.app/api/auth/register', form);
    alert('Request Submitted. Please wait for Admin Approval.');
    router.push('/login');
  } catch(e) {
    alert('Registration Failed: ' + e.message);
  }
};
</script>
