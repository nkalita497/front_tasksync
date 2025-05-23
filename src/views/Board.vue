<template>
  <div class="board">
    <!-- Kolumny tablicy -->
    <TaskColumn
        v-for="status in statuses"
        :key="status"
        :status="status"
        :title="statusLabels[status]"
        :tasks="tasks"
        @task-dropped="onTaskDropped"
        @add-task="openTaskForm"
        @task-selected="openEditTask"
    />
  </div>
</template>

<script setup>
import { useTasksStore } from '@/stores/tasks'
import { useModalStore } from '@/stores/modal'
import TaskColumn from '@/components/tasks/TaskColumn.vue'

// ---------- STORES ----------
const tasksStore = useTasksStore()
const modalStore = useModalStore()
const tasks = tasksStore.tasks

// ---------- KONFIGURACJA KOLUMN ----------
const statuses = ['todo', 'in-progress', 'done']
const statusLabels = {
  todo: 'Do zrobienia',
  'in-progress': 'W trakcie',
  done: 'Zrobione'
}

// ---------- HANDLERY ----------

// Przeciągnięto i upuszczono zadanie
const onTaskDropped = ({ taskId, newStatus }) => {
  const task = tasks.value.find(t => String(t.id) === String(taskId))
  if (task && task.status !== newStatus) {
    tasksStore.updateTask({ ...task, status: newStatus })
  }
}

// Kliknięto „+” w kolumnie → tworzymy nowe zadanie
const openTaskForm = (status) => {
  modalStore.openModal('Task', {
    mode: 'create',
    task: {
      title: '',
      description: '',
      status,
      priority: 'medium'
    }
  })
}

const openEditTask = (task) => {
  modalStore.openModal('Task', {
    mode: 'edit',
    task: { ...task }
  })
}
</script>

<style scoped>
.board {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
}
</style>
