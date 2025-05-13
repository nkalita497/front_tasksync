<template>
  <div class="auth">
    <LoginForm />
    <RegisterForm />
  </div>
</template>

<script setup>
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
</script>

<style>
.auth {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

@media (max-width: 768px) {
  .auth {
    flex-direction: column;
    align-items: center;
  }
}
</style>
