<template>
  <BootLoader />
  <Navbar />
  <router-view />
</template>
<script setup>
import BootLoader from './components/BootLoader.vue';
import Navbar from './components/Navbar.vue';
</script>
