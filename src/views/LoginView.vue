<template>
  <div class="auth">
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from '../components/auth/LoginForm.vue'
</script>

<style>
.auth {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .auth {
    flex-direction: column;
    align-items: center;
  }
}

</style>
