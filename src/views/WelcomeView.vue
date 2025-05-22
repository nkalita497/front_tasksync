<!-- src/views/WelcomeView.vue -->
<template>
  <div class="welcome-container">
    <img class="logo" src="../assets/TaskSyncLogo.svg" alt="Logo">

    <div class="welcome-actions">
      <router-link to="/login" class="welcome-button login-button">Zaloguj się</router-link>
      <router-link to="/register" class="welcome-button register-button">Zarejestruj się</router-link>
    </div>
    <p class="creators">Created by: Julia Staniszewska, Natalia Kalita, Taras Pryimachuk</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f4f4f9;
  text-align: center;
  padding: 0;
}

.logo{
  width: 35%;
  padding-bottom: 30px;
}

.creators{
  font-size: 14px;
  color: #05365b;
  position: absolute;
  bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.welcome-title {
  font-size: 2.5rem;
  color: #1693f9;
  margin-bottom: 1rem;
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 2rem;
}

.welcome-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.welcome-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;

}

.login-button {
  background-color: #1693f9;
  color: white;
}

.login-button:hover {
  background-color: #1281e0;
}

.register-button {
  background-color: white;
  color: #1693f9;
  border-color: #1693f9;
}

.register-button:hover {
  background-color: #f0f8ff;
}

@media (max-width: 768px) {
  .logo{
    width: 70%;
    padding-bottom: 30px;
  }

  .welcome-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
  }

  .welcome-button {
    width: 100%;
  }
}
</style>




