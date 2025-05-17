<template>
  <button @click="logout" class="logout-button">
    <span class="logout-icon"></span>
    Wyloguj
  </button>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error)
  }
}
</script>

<style scoped>
.logout-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', sans-serif;
}

.logout-button:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logout-button:active {
  transform: translateY(0);
}

.logout-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.logout-button:hover .logout-icon {
  transform: scale(1.1);
}
</style>