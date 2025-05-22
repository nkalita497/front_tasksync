<template>
  <div class="login-container">
    <h2 class="login-title">Logowanie</h2>
    <form @submit.prevent="submitLogin" class="login-form">
      <div class="form-group">

        <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder=" "
            required
        />
        <label class="form-label">Email</label>
      </div>

      <div class="form-group">

        <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder=" "
            required
        />
        <label class="form-label">Hasło</label>
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
    router.push('/tasks')
  } catch {
    errorMessage.value = 'Nieprawidłowy email lub hasło'
  }
}
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: auto;
  height: fit-content;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1693f9;
  margin-bottom: 3rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  position: relative;
  border: 1px solid #d1d5db;
  padding: 14px 20px 6px;
  border-radius: 3px;
  transition: border-color 0.3s;
  height: 40px;
}

.form-label {
  position: absolute;
  font-size: 1rem;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  transition: all 0.2s ease-out;
  padding: 0 0 0 9px;
  color: #999;
  pointer-events: none;
}

.form-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 6px 0;
  background: transparent;
  margin-top: 10px; /* im większy tym niżej będzie input */
}

.form-group:focus-within {
  border-color: #1693f9;
  box-shadow: 0 0 0 1px rgba(0, 21, 255, 0.61);
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label,
.form-input:valid + .form-label {
  top: 15px; /*im mniejsze tym wyżej będzie label po kliknięciu */
  left: 10px;
  font-size: 12px;

}

.login-button {
  padding: 0.75rem;
  background-color: #1693f9;
  color: white;
  border-radius: 3px;
  font-weight: 600;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 2rem;
  height: 60px;
}

.login-button:hover {
  background-color: #1281e0;
}

.error-message {
  color: #dc2626;
  font-size: 0.95rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

</style>
