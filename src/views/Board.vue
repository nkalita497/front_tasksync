<template>
  <div class="board">
    <!-- Kolumny -->
    <TaskColumn
        v-for="status in statuses"
        :key="status"
        :status="status"
        :title="statusLabels[status]"
        :tasks="tasks"
        @task-dropped="onTaskDropped"
        @add-task="openTaskForm"
        @task-selected="openTaskDetails"
    />

    <!-- Modale -->
    <TaskDetailsModal
        v-if="modalStore.activeModal === 'TaskDetails'"
        :open="true"
        :task="modalStore.modalProps.task"
        @close="modalStore.closeModal"
        @edit="onEditFromDetails"
        @delete="onDeleteFromDetails"
    />

    <TaskFormModal
        v-if="modalStore.activeModal === 'Task'"
        :open="true"
        :initialTask="modalStore.modalProps.task"
        :mode="modalStore.modalProps.mode"
        @close="modalStore.closeModal"
    />
  </div>
</template>

<script setup>
import { useTasksStore } from '@/stores/tasks'
import { useModalStore } from '@/stores/modal'
import TaskColumn from '@/components/tasks/TaskColumn.vue'
import TaskDetailsModal from '@/components/modals/TaskDetailsModal.vue'
import TaskFormModal from '@/components/modals/TaskFormModal.vue'

// ---------- STORES ----------
const tasksStore = useTasksStore()
const modalStore = useModalStore()
const tasks = tasksStore.tasks

// ---------- KOLUMNOWE ----------
const statuses = ['todo', 'in-progress', 'done']
const statusLabels = {
  todo: 'Do zrobienia',
  'in-progress': 'W trakcie',
  done: 'Zrobione'
}

// ---------- HANDLERY ----------
const onTaskDropped = ({ taskId, newStatus }) => {
  const task = tasks.value.find(t => String(t.id) === String(taskId))
  if (task && task.status !== newStatus) {
    tasksStore.updateTask({ ...task, status: newStatus })
  }
}

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

const openTaskDetails = (task) => {
  modalStore.openModal('TaskDetails', {
    task
  })
}

const onEditFromDetails = (task) => {
  modalStore.openModal('Task', {
    mode: 'edit',
    task: { ...task }
  })
}

const onDeleteFromDetails = async (taskId) => {
  const success = await tasksStore.deleteTask(taskId)
  if (success) {
    modalStore.closeModal()
    // Optionally: refresh task list from backend
  }
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
