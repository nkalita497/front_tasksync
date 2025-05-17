<template>
  <div class="auth">
    <RegisterForm />
  </div>
</template>

<script setup>
import RegisterForm from '../components/auth/RegisterForm.vue'
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
