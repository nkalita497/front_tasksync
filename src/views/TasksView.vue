<template>
  <div class="tasks-container">
    <div class="team-header">
      <h2>{{ teamStore.currentTeam.name }}</h2>
      <p v-if="teamStore.currentTeam.isPersonal" class="team-description">
        Twój osobisty obszar zadań
      </p>
      <p v-else class="team-description">
        Zespół: {{ teamStore.currentTeam.name }}
      </p>
    </div>

    <div class="board">
      <TaskColumn
          v-for="status in statuses"
          :key="status"
          :status="status"
          :title="statusLabels[status]"
          :tasks="filteredTasks(status)"
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
import { ref, computed } from 'vue'
import TaskColumn from '@/components/tasks/TaskColumn.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'
import { useTasksStore } from '@/stores/tasks'
import { useTeamStore } from '@/stores/team'

const tasksStore = useTasksStore()
const teamStore = useTeamStore()

const statuses = ['todo', 'in-progress', 'done']
const statusLabels = {
  'todo': 'Do zrobienia',
  'in-progress': 'W trakcie',
  'done': 'Zrobione'
}

const selectedTask = ref(null)

// Filtruj zadania według aktualnego zespołu
const filteredTasks = (status) => {
  return tasksStore.tasks.filter(task => {
    const matchesTeam = teamStore.currentTeam.isPersonal
        ? !task.teamId
        : task.teamId === teamStore.currentTeam.id
    return matchesTeam && task.status === status
  })
}

const onTaskDropped = ({ taskId, newStatus }) => {
  const task = tasksStore.tasks.find(t => t.id === taskId)
  if (task && task.status !== newStatus) {
    tasksStore.updateTask({ ...task, status: newStatus })
  }
}

const openTaskForm = (status) => {
  selectedTask.value = {
    title: '',
    description: '',
    status,
    priority: 'medium',
    teamId: teamStore.currentTeam.isPersonal ? null : teamStore.currentTeam.id
  }
}

const openEditTask = (task) => {
  selectedTask.value = { ...task }
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
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.team-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.team-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.team-description {
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.board {
  display: flex;
  gap: 1rem;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .board {
    flex-direction: column;
  }
}
</style>