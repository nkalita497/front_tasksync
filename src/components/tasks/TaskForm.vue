<template>
  <form @submit.prevent="submitTask" class="task-form">
    <div class="header">
      <h2>{{ isEditMode ? 'Edytuj zadanie' : 'Nowe zadanie' }}</h2>
      <button type="button" class="close-button" @click="$emit('close')">×</button>
    </div>

    <div class="form-group">
      <label>Tytuł:</label>
      <input v-model="title" required />
    </div>

    <div class="form-group">
      <label>Opis:</label>
      <textarea v-model="description" rows="3" />
    </div>

    <div class="form-group">
      <label>Priorytet:</label>
      <select v-model="priority">
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>
    </div>

    <div class="form-group">
      <label>Status:</label>
      <select v-model="status">
        <option value="todo">Do zrobienia</option>
        <option value="in-progress">W trakcie</option>
        <option value="done">Zrobione</option>
      </select>
    </div>

    <div class="form-group">
      <label>Przypisz do:</label>
      <input v-model="assignedTo" placeholder="Imię lub e-mail" />
    </div>

    <button type="submit">{{ isEditMode ? 'Zapisz zmiany' : 'Dodaj zadanie' }}</button>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps({
  taskToEdit: Object,
  visible: Boolean
})

const emit = defineEmits(['close'])

const tasksStore = useTasksStore()

const title = ref('')
const description = ref('')
const priority = ref('medium')
const assignedTo = ref('')
const id = ref(null)
const status = ref('todo')

const isEditMode = computed(() => !!props.taskToEdit)

watch(
    () => props.taskToEdit,
    (task) => {
      if (task) {
        title.value = task.title
        description.value = task.description
        priority.value = task.priority || 'medium'
        assignedTo.value = task.assignedTo || ''
        id.value = task.id
        status.value = task.status || 'todo'
      } else {
        clearForm()
      }
    },
    { immediate: true }
)

function submitTask() {
  const taskData = {
    id: id.value || Date.now().toString(),
    title: title.value,
    description: description.value,
    priority: priority.value,
    assignedTo: assignedTo.value,
    status: status.value,
    completed: false
  }

  if (isEditMode.value) {
    tasksStore.updateTask(taskData)
  } else {
    tasksStore.addTask(taskData)
  }

  clearForm()
  emit('close')
}

function clearForm() {
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  assignedTo.value = ''
  id.value = null
  status.value = 'todo'
}
</script>

<style scoped>
.task-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.close-button:hover {
  color: #000;
}

.task-form h2 {
  font-size: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
}

input,
textarea,
select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3b82f6;
  outline: none;
}

button[type="submit"] {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

button[type="submit"]:hover {
  background-color: #2563eb;
}
</style>
