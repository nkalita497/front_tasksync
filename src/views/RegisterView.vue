<template>
  <div class="auth">
    <router-link to="/">
    <img class="logo-top-left" src="../assets/TaskSyncLogo.svg" alt="Logo">
      </router-link>
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
  background-color: #f4f4f9;
  height: 100%;
  padding: 0;
}

.logo-top-left{
  position: absolute;
  height: 50px;
  top: 20px;
  left: 20px;
}

@media (max-width: 768px) {
  .auth {
    flex-direction: column;
    align-items: center;
  }
  
}

</style>
