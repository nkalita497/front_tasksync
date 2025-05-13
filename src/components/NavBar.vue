<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title">TaskSync</h1>
      <p class="sidebar-user">Witaj, {{ authStore.user?.name }}</p>
    </div>

    <ul class="sidebar-links">
      <li v-for="link in links" :key="link.path" class="sidebar-item">
        <router-link
            :to="link.path"
            class="sidebar-link"
            active-class="active-link"
        >
          <span class="sidebar-icon">{{ link.icon }}</span>
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '/src/stores/auth.js'

const authStore = useAuthStore()

const links = ref([
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/tasks', label: 'Zadania'},
  { path: '/users', label: 'Użytkownicy'}
])
</script>

<style scoped>
.sidebar {
  width: 16rem;
  background-color: #fb923c;
  color: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-header {
  margin-bottom: 2rem;
  padding: 0.5rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.sidebar-user {
  color: #fcd34d;
  font-size: 0.875rem;
}

.sidebar-links {
  list-style-type: none;
  padding: 0;
}

.sidebar-item {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease;
}

.sidebar-link:hover {
  background-color: #f97316;
}

.active-link {
  background-color: #ea580c;
}

.sidebar-icon {
  margin-right: 0.75rem;
}
</style>
