<template>
  <div class="task-columns">
    <div
        v-for="status in statuses"
        :key="status"
        class="task-column"
        @dragover.prevent
        @dragenter.prevent
        @drop="handleDrop(status)"
    >
      <h3>{{ getStatusLabel(status) }}</h3>
      <div class="task-list">
        <TaskItem
            v-for="task in filteredTasks(status)"
            :key="task.id"
            :task="task"
            @toggle="$emit('toggle', $event)"
            @delete="$emit('delete', $event)"
        />
        <div v-if="filteredTasks(status).length === 0" class="empty-message">
          Brak zadań
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()

const statuses = ['todo', 'in-progress', 'done']

const filteredTasks = (status) => {
  return tasksStore.tasks.filter(t => t.status === status)
}

const handleDrop = (targetStatus) => (e) => {
  e.preventDefault()
  const taskId = e.dataTransfer.getData('taskId')
  if (taskId) {
    const task = tasksStore.tasks.find(t => t.id === taskId)
    if (task && task.status !== targetStatus) {
      tasksStore.updateTask({
        ...task,
        status: targetStatus
      })
    }
  }
}

const getStatusLabel = (status) => {
  const labels = {
    'todo': 'Do zrobienia',
    'in-progress': 'W trakcie',
    'done': 'Zrobione'
  }
  return labels[status] || status
}
</script>

<style scoped>
.task-columns {
  display: flex;
  gap: 1rem;
}

.task-column {
  flex: 1;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  min-height: 300px;
}

.task-list {
  min-height: 200px;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.task-column[dragover] {
  background: #e5e7eb;
}
</style>