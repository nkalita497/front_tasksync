<!-- src/views/WelcomeView.vue -->
<template>
  <div class="welcome-container">
    <h1 class="welcome-title">Witaj w naszej aplikacji!</h1>
    <p class="welcome-subtitle">Co chcesz teraz zrobić?</p>

    <div class="welcome-actions">
      <router-link to="/login" class="welcome-button login-button">Zaloguj się</router-link>
      <router-link to="/register" class="welcome-button register-button">Zarejestruj się</router-link>
    </div>
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
  height: 100vh;
  background-color: #f4f4f9;
  text-align: center;
  padding: 2rem;
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
  .welcome-actions {
    flex-direction: column;
    width: 100%;
  }

  .welcome-button {
    width: 100%;
  }
}
</style>




