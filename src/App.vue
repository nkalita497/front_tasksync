<template>
  <div class="container">
    <LogoutButton v-if="isAuthenticated" />
    <NavBar v-if="isAuthenticated" />
    <Sidebar v-if="isAuthenticated" />

    <main class="main-content">
      <router-view />
    </main>

    <!-- Modal tworzenia zespołu -->
    <CreateTeamModal
        v-if="modalStore.activeModal === 'CreateTeam'"
        @close="modalStore.closeModal"
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useTeamStore } from './stores/team'
import { useModalStore } from './stores/modal'

import NavBar from './components/NavBar.vue'
import LogoutButton from './components/auth/LogoutButton.vue'

import CreateTeamModal from './components/modals/CreateTeam.vue'

const authStore = useAuthStore()
const teamStore = useTeamStore()
const modalStore = useModalStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(() => {
  teamStore.init()
})
</script>

<style>

.container {
  display: flex;
  min-height: 100%;
  background-color: #faf5e6;
  position: relative;
  height: 100%;
  width: 100%;
}

.main-content {
  flex: 1;
  transition: all 0.3s ease-in-out;
  padding: 0;
  height: 100%;
}
</style>
