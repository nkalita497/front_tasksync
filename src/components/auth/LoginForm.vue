<template>
  <div class="login-container">
    <h2 class="login-title">Logowanie</h2>
    <form @submit.prevent="submitLogin" class="login-form">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="twój@email.com"
            required
        />
      </div>

      <div class="form-group">
        <label class="form-label">Hasło</label>
        <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
        />
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit" class="login-button">Zaloguj się</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

const submitLogin = async () => {
  errorMessage.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch {
    errorMessage.value = 'Nieprawidłowy email lub hasło'
  }
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
  color: #1693f9;
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
  border-color: #1693f9;
  box-shadow: 0 0 0 2px rgba(0, 21, 255, 0.61);
}

.login-button {
  padding: 0.75rem;
  background-color: #1693f9;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.login-button:hover {
  background-color: #1281e0;
}

.error-message {
  color: #dc2626; /* bardziej klasyczny czerwony dla błędu */
  font-size: 0.95rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

</style>
