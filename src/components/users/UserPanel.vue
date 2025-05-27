<template>
  <div class="user-panel">
    <div class="user-info" @click="toggleDropdown">
      <div class="user-avatar">
        <span class="avatar-text">{{ userInitials }}</span>
      </div>
      <div class="user-details">
        <p class="user-name">{{ fullName }}</p>
        <p class="user-role">{{ authStore.user?.email }}</p>
      </div>
      <div class="dropdown-arrow" :class="{ 'open': isDropdownOpen }">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
    </div>

    <div v-if="isDropdownOpen" class="user-dropdown">
      <div class="dropdown-item" @click="openEditModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 6L9 17l-5-5"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Edytuj profil
      </div>
      <div class="dropdown-item" @click="viewProfile">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Mój profil
      </div>
      <div class="dropdown-divider"></div>
      <div class="dropdown-item logout" @click="logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16,17 21,12 16,7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Wyloguj się
      </div>
    </div>

    <UserEditModal
        v-if="showEditModal"
        :user="authStore.user"
        @close="showEditModal = false"
        @user-updated="handleUserUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import UserEditModal from './UserEditModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const isDropdownOpen = ref(false)
const showEditModal = ref(false)

const userInitials = computed(() => {
  const user = authStore.user
  if (!user) return 'U'
  const first = user.firstName?.charAt(0) || ''
  const last = user.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
})

const fullName = computed(() => {
  const user = authStore.user
  if (!user) return 'Użytkownik'
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Użytkownik'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const openEditModal = () => {
  showEditModal.value = true
  closeDropdown()
}

const viewProfile = () => {
  router.push('/profile')
  closeDropdown()
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error)
  }
  closeDropdown()
}

const handleUserUpdate = () => {
  // Odśwież dane użytkownika
  authStore.me()
}

// Zamknij dropdown przy kliknięciu poza nim
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-panel')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-panel {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: #e8edf7;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 0.75rem;
}

.user-info:hover {
  background-color: #dde2f3;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #273756;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-arrow {
  color: #64748b;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
  color: #374151;
  min-height: 44px;
}

.dropdown-item:hover {
  background-color: #f8fafc;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background-color: #fef2f2;
}

.dropdown-divider {
  height: 1px;
  background-color: #e2e8f0;
  margin: 0.5rem 0;
}
</style>
