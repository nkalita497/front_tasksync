<template>
  <div class="user-profile">
    <h2 class="profile-name">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h2>
    <p class="profile-email">{{ authStore.user?.email }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps({
  user: {
    type: Object,
    default: () => authStore.user
  }
})
</script>

<style scoped>
.user-profile {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.profile-name {
  font-size: 24px;
  margin-bottom: 10px;
}

.profile-email {
  font-size: 16px;
  color: #555;
}
</style>
