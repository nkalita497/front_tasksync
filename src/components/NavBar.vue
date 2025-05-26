<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <img class="sidebar-logo" src="../assets/TaskSyncLogo.svg" alt="Logo">
      <p class="sidebar-user">Witaj, {{ authStore.user?.firstName }}</p>
    </div>


    <div class="team-selector-bottom">
      <div class="team-select-header" @click="toggleTeamDropdown">

        <span>{{ teamStore.currentTeamName }}</span>
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
          {{ team.teamName }}
<!--          <span v-if="team.isPersonal" class="personal-badge">Osobiste</span>-->
        </div>

        <div class="team-divider"></div>

        <div class="team-item create-team" @click="openCreateTeamModal">
          <span>+ Utwórz nowy zespół</span>
        </div>
      </div>
    </div>


    <ul class="sidebar-links">
      <li v-for="link in links" :key="link.path" class="sidebar-item">
        <router-link
            :to="link.path"
            class="sidebar-link"
            active-class="active-link"
        >
<!--          <span class="sidebar-icon"></span>-->
          <img :src=link.icon alt="TasksIcon" class="sidebar-icon">
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {ref, onMounted, onBeforeMount} from 'vue'
import { useAuthStore } from '/src/stores/auth.js'
import { useTeamStore } from '/src/stores/team.js'
import { useModalStore } from '/src/stores/modal.js'

const authStore = useAuthStore()
const teamStore = useTeamStore()
const modalStore = useModalStore()
import tasksIC from '/src/assets/tasksIcon.svg';
import usersIC from '/src/assets/usersIcon.svg';
import {data} from "autoprefixer";

// teamStore.fetchTeams();
// authStore.me();
// console.log(teamStore.currentTeamName)


const isTeamDropdownOpen = ref(false)

const links = ref([
  { path: '/tasks', label: 'Zadania', icon: tasksIC },
  { path: '/users', label: 'Użytkownicy', icon: usersIC }
])

onMounted(async() => {
  // teamStore.setCurrentTeam(localStorage.getItem('selectedTeam')*1)
  await teamStore.fetchTeams()
  await authStore.me();
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
  width: 250px;
  padding: 0;
  background-color: #f4f4f9;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-header {
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
}

.sidebar-logo {
  max-width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;

}

.sidebar-user {
  font-size: 0.875rem;
  width: fit-content;
  max-width: 100%;
  color: #273756;
  margin: 0;
}

.sidebar-links {
  list-style-type: none;
  width: 86%;
  padding: 0;
  flex-grow: 0.5;
}

.sidebar-item {
  font-size: 15px;
  font-weight: normal;
  margin-bottom: 15px;


}

.sidebar-link {
  height: 15px;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid transparent;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.5s ease;
  font-weight: 400;
  color: #273756;
}

.active-link{
  border: 1px solid #273756;
  background-color: #dde2f3;

}

.sidebar-link:hover {
  background-color: #dbe0f2;
}

.sidebar-icon {
  margin-right: 0.75rem;
  width: 22px;
}

/* Nowa sekcja na dole */
.team-selector-bottom {
  margin-top: 1rem;
  position: relative;
  width: 100%;
  margin-bottom: 30px;
}

.team-select-header {
  padding: 0.75rem;
  background-color: rgb(219, 224, 242);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  height: 40px;
  font-weight: 400;
  color: #273756;
}



.dropdown-icon {
  font-size: 0.8rem;
}

.team-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #d9def1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-top: 4px;
  overflow: hidden;

}

.team-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 40px;

}

.team-item:hover {
  font-weight: 500;
}

.active-team {
  background-color: rgb(217, 222, 241);
  font-weight: 500;
}

.personal-badge {
  font-size: 0.7rem;
  background-color: rgb(242, 242, 248);
  padding: 0.2rem 0.4rem;
  border-radius: 0.75rem;
  margin-left: 0.5rem;
}

.team-divider {
  height: 4px;
  background-color: rgb(242, 242, 248);
}

.create-team {
  display: flex;
  align-items: center;
  color: #151610;
  background-color: #c9cfe7;
  font-weight: 500;
  height: 40px;
}
</style>
