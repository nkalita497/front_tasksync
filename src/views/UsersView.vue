<template>
  <div class="users-container">
    <h1 class="header">Użytkownicy</h1>
    <div class="user-list">
      <div class="user-card">
        <h3 class="user-name">Użytkownik 1</h3>
        <p class="user-email">email1@example.com</p>
      </div>
      <div class="user-card">
        <h3 class="user-name">Użytkownik 2</h3>
        <p class="user-email">email2@example.com</p>
      </div>
      <div class="user-card">
        <h3 class="user-name">Użytkownik 3</h3>
        <p class="user-email">email3@example.com</p>
      </div>
    </div>
  </div>
</template>

<script setup>
//Można zaimportowac dane uzytkownikow albo dodac logike TODO
</script>

<style>
.users-container {
  padding: 2rem;
}

.header {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.user-email {
  font-size: 1rem;
  color: #666;
}
</style>
