<template>
  <div class="groups-container">
    <h2>Grupy z użytkownikami</h2>
    <!-- tu może być lista grup i użytkowników -->
    <div class="group">
      <h3 class="group-title">Grupa 1</h3>
      <ul class="user-list">
        <li class="user-item">Użytkownik 1</li>
        <li class="user-item">Użytkownik 2</li>
        <li class="user-item">Użytkownik 3</li>
      </ul>
    </div>

    <div class="group">
      <h3 class="group-title">Grupa 2</h3>
      <ul class="user-list">
        <li class="user-item">Użytkownik A</li>
        <li class="user-item">Użytkownik B</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// tutaj możesz zaimportować potrzebne dane i logikę
</script>

<style>
.groups-container {
  padding: 2rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.group {
  margin-bottom: 2rem;
}

.group-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.user-list {
  list-style-type: none;
  padding-left: 0;
}

.user-item {
  background-color: #f7f7f7;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  color: #555;
}

.user-item:hover {
  background-color: #e1e1e1;
}
</style>
