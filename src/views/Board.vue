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

    <!-- Modal tworzenia / edycji zadania -->
    <TaskModal
        v-if="selectedTask"
        :task="selectedTask"
        @close="selectedTask = null"
        @save="onTaskSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskColumn from '@/components/tasks/TaskColumn.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'
import { useTasksStore } from '@/stores/tasks'

// ---------- STORE ----------
const tasksStore = useTasksStore()
// tasks to ref → w szablonie automatycznie się rozpakowuje
const tasks = tasksStore.tasks

// ---------- KONFIGURACJA KOLUMN ----------
const statuses = ['todo', 'in-progress', 'done']
const statusLabels = {
  todo: 'Do zrobienia',
  'in-progress': 'W trakcie',
  done: 'Zrobione'
}

// ---------- STAN UI ----------
const selectedTask = ref(null) // aktualnie edytowane / tworzone zadanie

// ---------- HANDLERY ----------
// Przeciągnięto i upuszczono zadanie do innej kolumny
const onTaskDropped = ({ taskId, newStatus }) => {
  // upewnij się, że porównujesz string‑to‑string
  const task = tasks.value.find(t => String(t.id) === String(taskId))
  if (task && task.status !== newStatus) {
    tasksStore.updateTask({ ...task, status: newStatus })
  }
}

// Kliknięto „+” w kolumnie → tworzymy puste zadanie z domyślnym statusem
const openTaskForm = (status) => {
  selectedTask.value = {
    title: '',
    description: '',
    type: 'Task',
    status,
    priority: 'medium'
  }
}

// Kliknięto istniejące zadanie → edycja
const openEditTask = (task) => {
  selectedTask.value = { ...task }
}

// Zapis z modala (create lub update)
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
.board {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
}
</style>
