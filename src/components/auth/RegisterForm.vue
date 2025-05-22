<template>
  <div class="register-container">
    <h2 class="register-title">Zarejestruj się</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <input v-model="firstName" type="text" class="form-input" placeholder=" " required />
        <label class="form-label">Imię</label>
      </div>

      <div class="form-group">
        <input v-model="lastName" type="text" class="form-input" placeholder=" " required />
        <label class="form-label">Nazwisko</label>
      </div>

      <div class="form-group">
        <input v-model="email" type="email" class="form-input" placeholder=" " required />
        <label class="form-label">Email</label>
      </div>

      <div class="form-group">
        <input v-model="password" type="password" class="form-input" placeholder=" " required />
        <label class="form-label">Hasło</label>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit" class="register-button">Zarejestruj się</button>

      <p class="login-link">
        Masz już konto? <router-link to="/login">Zaloguj się</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

const register = async () => {
  errorMessage.value = ''
  try {
    await authStore.register(firstName.value, lastName.value, email.value, password.value)
    // Zmienione z '/dashboard' na '/login'
    router.push('/login')
  } catch {
    errorMessage.value = 'Coś poszło nie tak podczas rejestracji. Spróbuj ponownie.'
  }
}
</script>

<style scoped>

.register-container {
  width: 400px;
  margin: auto;
  height: fit-content;
}

.register-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1693f9;
  margin-bottom: 3rem;
  text-align: center;
}

.register-form {
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


.register-button {
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

.register-button:hover {
  background-color: #1281e0;
}

.error-message {
  color: #dc2626;
  font-size: 0.95rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.login-link a{
  text-decoration: none;
  color: #1281e0;
  font-weight: bold;
}


@media (max-width: 768px) {
  .register-container{
    width: 80%;
    background: transparent;
    box-shadow: none;
  }

}
</style>