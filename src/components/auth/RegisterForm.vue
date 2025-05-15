<template>
  <div class="register-container">
    <h2 class="register-title">Rejestracja</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label class="form-label">Imię</label>
        <input v-model="name" type="text" class="form-input" placeholder="Twoje imię" required />
      </div>

      <div class="form-group">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-input" placeholder="twój@email.com" required />
      </div>

      <div class="form-group">
        <label class="form-label">Hasło</label>
        <input v-model="password" type="password" class="form-input" placeholder="••••••••" required />
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit" class="register-button">Zarejestruj się</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

const register = async () => {
  errorMessage.value = ''
  try {
    await authStore.register(name.value, email.value, password.value)
    router.push('/dashboard')
  } catch {
    errorMessage.value = 'Coś poszło nie tak podczas rejestracji. Spróbuj ponownie.'
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.register-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f97316;
  margin-bottom: 1.5rem;
  text-align: center;
}

.register-form {
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

.register-button {
  padding: 0.75rem;
  background-color: #f97316;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.register-button:hover {
  background-color: #ea580c;
}

.error-message {
  color: #dc2626;
  font-size: 0.95rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
</style>
