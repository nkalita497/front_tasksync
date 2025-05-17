<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ mode === 'create' ? 'Nowe zadanie' : 'Edytuj zadanie' }}</h3>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Tytuł:</label>
          <input v-model="formData.title" class="form-control" required />
        </div>

        <div class="form-group">
          <label>Opis:</label>
          <textarea v-model="formData.description" rows="3" class="form-control"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Status:</label>
            <select v-model="formData.status" class="form-control">
              <option value="todo">Do zrobienia</option>
              <option value="in-progress">W trakcie</option>
              <option value="done">Zrobione</option>
            </select>
          </div>

          <div class="form-group">
            <label>Priorytet:</label>
            <select v-model="formData.priority" class="form-control">
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Anuluj</button>
        <button class="btn-save" @click="saveTask">Zapisz</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  task: Object,
  mode: String
})

const emit = defineEmits(['save', 'close'])

const formData = ref({
  id: null,
  type: 'Task',
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium'
})

watch(() => props.task, (task) => {
  if (task) {
    formData.value = {
      id: task.id,
      type: task.type || 'Task',
      title: task.title,
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  formData.value = {
    id: null,
    type: 'Task',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  }
}

const saveTask = () => {
  emit('save', { ...formData.value })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 4px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dfe1e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #172b4d;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b778c;
  line-height: 1;
}

.close-button:hover {
  color: #172b4d;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #5e6c84;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  font-size: 0.9rem;
}

.form-control:focus {
  outline: none;
  border-color: #4c9aff;
  box-shadow: 0 0 0 2px rgba(76, 154, 255, 0.3);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dfe1e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-cancel, .btn-save {
  padding: 0.5rem 1rem;
  border-radius: 3px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-cancel {
  background: none;
  border: 1px solid #dfe1e6;
  color: #5e6c84;
}

.btn-cancel:hover {
  background: #f4f5f7;
}

.btn-save {
  background: #0052cc;
  border: none;
  color: white;
}

.btn-save:hover {
  background: #0065ff;
}
</style>