<template>
  <div class="container">
    <NavBar v-if="isAuthenticated" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style>
.container {
  display: flex;
  min-height: 100vh;
  background-color: #faf5e6;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
}
</style>
