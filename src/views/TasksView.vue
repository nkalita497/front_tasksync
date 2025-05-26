<template>
  <div class="tasks-container">
    <div class="team-header">
      <h2>{{ teamStore.currentTeamName }}</h2>
      <p class="team-description">
        {{ teamStore.allTeams?.find(team => team.id === teamStore.currentTeamId)?.description }}
      </p>
    </div>

    <div class="board">
      <TaskColumn
          v-for="status in statuses"
          :key="status"
          :status="status"
          :title="statusLabels[status]"
          :tasks="filteredTasks()"
          @task-dropped="onTaskDropped"
          @add-task="openTaskForm"
          @task-selected="openEditTask"
      />

      <TaskModal
          v-if="selectedTask"
          :task="selectedTask"
          @close="selectedTask = null"
          @save="onTaskSave"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import TaskColumn from '@/components/tasks/TaskColumn.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'
import {useTasksStore} from '@/stores/tasks'
import {useTeamStore} from '@/stores/team'

const tasksStore = useTasksStore()
const teamStore = useTeamStore()

const statuses = ['TO_DO', 'IN_PROGRESS', 'DONE']
const statusLabels = {
  'TO_DO': 'Do zrobienia',
  'IN_PROGRESS': 'W trakcie',
  'DONE': 'Zrobione'
}

const selectedTask = ref(null)

const loadTasks = async () => {
  if (teamStore.currentTeamId) {
    await tasksStore.fetchTasks(teamStore.currentTeamId)
  }
}

onMounted(loadTasks)

watch(() => teamStore.currentTeamId, async () => {
  await loadTasks()
})



// Filtruj zadania według aktualnego zespołu
const filteredTasks = () => {
  return tasksStore.tasks?.filter(task => {
    return (task.teamId === teamStore.currentTeamId)
  })
}

const onTaskDropped = ({taskId, newStatus}) => {
  const task = tasksStore.tasks.find(t => t.id === taskId)
  if (task && task.status !== newStatus) {
    tasksStore.updateTask({...task, status: newStatus})
  }
}

const openTaskForm = (status) => {
  selectedTask.value = {
    title: '',
    description: '',
    status,
    priority: 'medium',
    teamId: teamStore.allTeams?.find(team => team.id === teamStore.currentTeamId)?.id
  }
}

const openEditTask = (task) => {
  selectedTask.value = {...task}
}

const onTaskSave = (task) => {
  if (task.id) {
    tasksStore.updateTask(task)
  } else {
    tasksStore.addTask(task)
  }
  selectedTask.value = null
}
</script>

<style scoped>
.tasks-container {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f9;
}

.team-header {
  padding: 15px 30px 20px;
  border-bottom: 1px solid #adb6d2;
}

.team-header h2 {
  margin: 0;
  font-size: 30px;
  color: #1e293b;
}

.team-description {
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 15px;
}

.board {
  display: flex;
  gap: 1rem;
  flex: 1;
  overflow-x: auto;
  padding: 15px;
}

@media (max-width: 768px) {
  .board {
    flex-direction: column;
  }
}
</style>