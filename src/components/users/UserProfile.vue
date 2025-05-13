<template>
  <div class="profile">
    <h2 class="profile-name">{{ user.name }}</h2>
    <p class="profile-email">{{ user.email }}</p>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.profile {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 1.5rem auto;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
}

.profile-email {
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.5rem;
}
</style>
