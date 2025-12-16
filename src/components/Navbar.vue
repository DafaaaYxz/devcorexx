<template>
  <nav class="navbar" v-if="!configStore.loadingBoot">
    <div class="nav-container">
      <div class="logo retro-font">DevCORE <span class="ver">v2.1</span></div>
      
      <button class="menu-toggle" @click="isOpen = !isOpen">
        <i class="fas" :class="isOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>

      <div :class="['nav-links', { 'active': isOpen }]">
        <!-- LOGO/HOME -->
        <router-link to="/" @click="isOpen = false" class="retro-font">HOME</router-link>
        
        <template v-if="authStore.isAuthenticated">
          <router-link to="/terminal" @click="isOpen = false" class="retro-font">TERMINAL</router-link>
          
          <!-- DOCS LINK -->
          <router-link to="/docs" @click="isOpen = false" class="retro-font">DOCS</router-link>

          <!-- PROFILE & LOGOUT -->
          <div class="profile-group">
            <router-link to="/profile" @click="isOpen = false" class="retro-font profile-link">
                <i class="fas fa-user-circle"></i> PROFILE
            </router-link>
            <router-link v-if="authStore.isAdmin" to="/admin" @click="isOpen = false" class="retro-font text-gold">ADMIN</router-link>
            <a @click="handleLogout" class="retro-font text-danger">LOGOUT</a>
          </div>
        </template>
        
        <router-link v-else to="/about" @click="isOpen = false" class="retro-font">ABOUT</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useConfigStore } from '../stores/configStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const configStore = useConfigStore();
const router = useRouter();
const isOpen = ref(false);

const handleLogout = () => {
  isOpen.value = false;
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar { background: rgba(2, 6, 23, 0.95); border-bottom: 2px solid var(--primary); position: sticky; top: 0; z-index: 100; }
.nav-container { max-width: 1200px; margin: 0 auto; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; position: relative; }
.logo { color: white; font-size: 1.1rem; }
.ver { font-size: 0.6rem; color: var(--accent); }
.text-danger { color: var(--danger) !important; cursor: pointer; }
.text-gold { color: #fbbf24 !important; }
.nav-links { display: flex; gap: 20px; align-items: center; }
.nav-links a { color: var(--text-dim); font-size: 0.7rem; transition: 0.3s; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--accent); }
.menu-toggle { display: none; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.profile-group { display: flex; gap: 15px; border-left: 1px solid #333; padding-left: 15px; }

@media (max-width: 768px) {
  .menu-toggle { display: block; }
  .nav-links { position: absolute; top: 100%; left: 0; width: 100%; background: #020617; flex-direction: column; padding: 20px; border-bottom: 2px solid var(--primary); display: none; }
  .nav-links.active { display: flex; animation: slideDown 0.3s ease; }
  .nav-links a { font-size: 0.9rem; padding: 10px; border-bottom: 1px solid #1e293b; width: 100%; text-align: center; }
  .profile-group { border: none; padding: 0; flex-direction: column; width: 100%; gap: 0; }
}
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
