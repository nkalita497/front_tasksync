<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title">TaskSync</h1>
      <p class="sidebar-user">Witaj, {{ authStore.user?.name }}</p>
    </div>

    <ul class="sidebar-links">
      <li v-for="link in links" :key="link.path" class="sidebar-item">
        <router-link
            :to="link.path"
            class="sidebar-link"
            active-class="active-link"
        >
          <span class="sidebar-icon">{{ link.icon }}</span>
          {{ link.label }}
        </router-link>
      </li>
    </ul>

    <div class="team-selector-bottom">
      <div class="team-select-header" @click="toggleTeamDropdown">
        <span>{{ teamStore.currentTeam.name }}</span>
        <span class="dropdown-icon">{{ isTeamDropdownOpen ? '▲' : '▼' }}</span>
      </div>

      <div v-if="isTeamDropdownOpen" class="team-dropdown">
        <div
            v-for="team in teamStore.allTeams"
            :key="team.id"
            class="team-item"
            :class="{ 'active-team': team.id === teamStore.currentTeamId }"
            @click="selectTeam(team.id)"
        >
          {{ team.name }}
          <span v-if="team.isPersonal" class="personal-badge">Osobiste</span>
        </div>

        <div class="team-divider"></div>

        <div class="team-item create-team" @click="openCreateTeamModal">
          <span>+ Utwórz nowy zespół</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '/src/stores/auth.js'
import { useTeamStore } from '/src/stores/team.js'
import { useModalStore } from '/src/stores/modal.js'

const authStore = useAuthStore()
const teamStore = useTeamStore()
const modalStore = useModalStore()

const isTeamDropdownOpen = ref(false)

const links = ref([
  { path: '/tasks', label: 'Zadania' },
  { path: '/users', label: 'Użytkownicy' }
])

onMounted(() => {
  teamStore.init()
})

const toggleTeamDropdown = () => {
  isTeamDropdownOpen.value = !isTeamDropdownOpen.value
}

const selectTeam = (teamId) => {
  teamStore.setCurrentTeam(teamId)
  isTeamDropdownOpen.value = false
}

const openCreateTeamModal = () => {
  modalStore.openModal('CreateTeam')
  isTeamDropdownOpen.value = false
}
</script>

<style scoped>
.sidebar {
  width: 16rem;
  background-color: #4382e4;
  color: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.sidebar-user {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.sidebar-links {
  list-style-type: none;
  padding: 0;
  flex-grow: 1;
}

.sidebar-item {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.sidebar-link:hover {
  background-color: #2141e4;
}

.sidebar-icon {
  margin-right: 0.75rem;
}

/* Nowa sekcja na dole */
.team-selector-bottom {
  margin-top: 1rem;
  position: relative;
}

.team-select-header {
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.team-select-header:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dropdown-icon {
  font-size: 0.8rem;
}

.team-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #2c6bdb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-top: 0.5rem;
  overflow: hidden;
}

.team-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.team-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active-team {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.personal-badge {
  font-size: 0.7rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.4rem;
  border-radius: 0.75rem;
  margin-left: 0.5rem;
}

.team-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0.25rem 0;
}

.create-team {
  color: #a0c4ff;
  font-weight: 500;
}
</style>
