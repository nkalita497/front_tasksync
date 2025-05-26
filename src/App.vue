<template>
  <div class="container">
    <LogoutButton v-if="isAuthenticated" />
    <NavBar v-if="isAuthenticated" />
<!--    <Sidebar v-if="isAuthenticated" />-->

    <main class="main-content">
      <router-view />
    </main>

    <!-- Modal tworzenia zespołu -->
    <CreateTeamModal
        v-if="modalStore.activeModal === 'CreateTeam'"
        @close="modalStore.closeModal"
    />

    <!-- Modal tworzenia / edycji zadania -->

    <TaskModal
        v-if="showModal"
        ref="taskModal"
        :task="selectedTask"
        :mode="mode"
        @save="handleSave"
        @close="showModal = false"
    />



  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useTeamStore } from './stores/team'
import { useModalStore } from './stores/modal'
import { useTasksStore } from './stores/tasks'

import NavBar from './components/NavBar.vue'
import LogoutButton from './components/auth/LogoutButton.vue'
import CreateTeamModal from './components/modals/CreateTeam.vue'
import TaskModal from './components/tasks/TaskModal.vue'

// ---------- STORES ----------
const authStore = useAuthStore()
const teamStore = useTeamStore()
const modalStore = useModalStore()
const tasksStore = useTasksStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)


// ---------- LIFECYCLE ----------
onMounted(() => {
  teamStore.fetchTeams();
})

const openModalAtClick = (event) => {
  showModal.value = true
  nextTick(() => {
    refs.taskModal.setClickPosition(event.clientX, event.clientY)
  })
}
// ---------- HANDLERY ----------
function handleTaskSave(task) {
  if (task.id) {
    tasksStore.updateTask(task)
  } else {
    tasksStore.addTask(task)
  }
  modalStore.closeModal()
}
</script>

<style>
.container {
  display: flex;
  min-height: 100vh;
  background-color: #faf5e6;
  width: 100%;
}
.main-content {
  flex: 1;
  transition: all 0.3s ease-in-out;
  padding: 0;
  min-height: 100vh;
  position: relative;

}
</style>
