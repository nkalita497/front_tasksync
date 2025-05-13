<template>
  <div class="login-container">
    <h2 class="login-title">Logowanie</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="twój@email.com"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Hasło</label>
        <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
        />
      </div>
      <button type="submit" class="login-button">
        Zaloguj się
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const login = async () => {
  await authStore.login(email.value, password.value)
  router.push('/dashboard')
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f97316;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  outline: none;
}

.form-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(255, 145, 0, 0.4);
}

.login-button {
  padding: 0.75rem;
  background-color: #f97316;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  border: none;
}

.login-button:hover {
  background-color: #ea580c;
}
</style>
