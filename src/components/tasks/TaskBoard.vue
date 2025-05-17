<template>
  <div class="task-board">
    <div class="board-header">
      <h2>{{ boardName }}</h2>
      <div class="board-actions">
        <button class="new-task-btn" @click="openCreateModal">
          <span>+</span> Nowe zadanie
        </button>
      </div>
    </div>

    <div class="board-columns">
      <TaskColumn
          v-for="column in columns"
          :key="column.status"
          :status="column.status"
          :title="column.title"
          :tasks="tasks"
          @task-dropped="handleTaskDrop"
          @add-task="openCreateModal"
          @task-selected="openEditModal"
      />
    </div>

    <TaskModal
        v-if="showModal"
        :task="selectedTask"
        :mode="modalMode"
        @save="handleSaveTask"
        @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import TaskColumn from './TaskColumn.vue'
import TaskModal from './TaskModal.vue'

const tasksStore = useTasksStore()

const boardName = ref('Tablica zadań')
const showModal = ref(false)
const selectedTask = ref(null)
const modalMode = ref('create')

const columns = [
  { status: 'todo', title: 'Do zrobienia' },
  { status: 'in-progress', title: 'W trakcie' },
  { status: 'done', title: 'Zrobione' }
]

const tasks = computed(() => tasksStore.tasks)

const openCreateModal = (status) => {
  selectedTask.value = { status: status || 'todo' }
  modalMode.value = 'create'
  showModal.value = true
}

const openEditModal = (task) => {
  selectedTask.value = { ...task }
  modalMode.value = 'edit'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

const handleSaveTask = (taskData) => {
  if (modalMode.value === 'create') {
    tasksStore.addTask(taskData)
  } else {
    tasksStore.updateTask(taskData)
  }
  closeModal()
}

const handleTaskDrop = ({ taskId, newStatus }) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task && task.status !== newStatus) {
    tasksStore.updateTask({
      ...task,
      status: newStatus
    })
  }
}
</script>

<style scoped>
.task-board {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.board-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #172b4d;
}

.board-actions {
  display: flex;
  gap: 1rem;
}

.new-task-btn {
  background: #0052cc;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.2s;
}

.new-task-btn:hover {
  background: #0065ff;
}

.new-task-btn span {
  font-size: 1.2rem;
}

.board-columns {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  flex: 1;
  padding-bottom: 1rem;
}
</style>