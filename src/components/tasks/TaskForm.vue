<template>
  <form @submit.prevent="submitTask" class="task-form">
    <h2>Nowe zadanie</h2>

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
      <label>Przypisz do:</label>
      <input v-model="assignedTo" placeholder="Imię lub e-mail" />
    </div>

    <button type="submit">Dodaj zadanie</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const { addTask } = useTasksStore()

const title = ref('')
const description = ref('')
const priority = ref('medium')
const assignedTo = ref('')

function submitTask() {
  const newTask = {
    id: Date.now(),
    title: title.value,
    description: description.value,
    priority: priority.value,
    assignedTo: assignedTo.value,
    completed: false
  }

  addTask(newTask)

  // Wyczyść formularz
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  assignedTo.value = ''
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
}

.task-form h2 {
  margin-bottom: 16px;
  font-size: 20px;
  color: #333;
  text-align: center;
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

button {
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

button:hover {
  background-color: #2563eb;
}
</style>
