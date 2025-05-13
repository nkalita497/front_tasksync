<template>
  <form @submit.prevent="register" class="register-form">
    <input v-model="name" type="text" placeholder="Imię" class="form-input">
    <input v-model="email" type="email" placeholder="Email" class="form-input">
    <input v-model="password" type="password" placeholder="Hasło" class="form-input">
    <button type="submit" class="register-button">Zarejestruj</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const register = async () => {
  await authStore.register(name.value, email.value, password.value)
  router.push('/dashboard')
}
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
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
  font-weight: medium;
  transition: background-color 0.3s;
  border: none;
}

.register-button:hover {
  background-color: #ea580c;
}
</style>
