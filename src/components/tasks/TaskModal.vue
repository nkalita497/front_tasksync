<template>
  <transition name="modal">
    <div class="modal-overlay" @click.self="closeModal">
      <div
          class="modal-content"
          :style="{
          transformOrigin: `${clickX}px ${clickY}px`
        }"
      >
        <div class="modal-header">
          <h3>{{ mode === 'create' ? 'Nowe zadanie' : 'Edytuj zadanie' }}</h3>
          <button class="close-button" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-body-info">
            <div class="form-group">
              <label>Tytuł:</label>
              <input v-model="formData.title" class="form-control" required/>
            </div>

            <div class="form-group">
              <label>Opis:</label>
              <textarea v-model="formData.description" rows="3" class="form-control"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Status:</label>
                <select v-model="formData.status" class="form-control">
                  <option value="TO_DO">Do zrobienia</option>
                  <option value="IN_PROGRESS">W trakcie</option>
                  <option value="DONE">Zrobione</option>
                </select>
              </div>

              <div class="form-group">
                <label>Priorytet:</label>
                <select v-model="formData.priority" class="form-control">
                  <option value="LOW">Niski</option>
                  <option value="MEDIUM">Średni</option>
                  <option value="HIGH">Wysoki</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-body-subtasks">
            <label>Podzadania:</label>
            <div v-for="(subtask, index) in formData.subtasks" :key="index" class="subtask-item">
              <label class="custom-checkbox">
                <input
                    type="checkbox"
                    v-model="subtask.completed"
                    class="subtask-checkbox"
                >
                <span class="checkmark"></span>
              </label>
              <input
                  type="text"
                  v-model="subtask.title"
                  class="subtask-input"
                  placeholder="Nazwa podzadania"
              >
              <button @click="removeSubtask(index)" class="subtask-remove">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button @click="addSubtask" class="btn-add-subtask">
              + Dodaj podzadanie
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Anuluj</button>
          <button class="btn-save" @click="saveTask">
            {{ mode === 'create' ? 'Dodaj zadanie' : 'Zapisz zmiany' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {ref, watch, onMounted, onBeforeUnmount} from 'vue'
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore();

const props = defineProps({
  task: Object,
  mode: {type: String, default: 'create'}
})

const emit = defineEmits(['save', 'close'])

const formData = ref({
  id: null,
  title: '',
  description: '',
  status: 'TO_DO',
  priority: 'MEDIUM',
  assignedTo: '',
  subtasks: []
})

const clickX = ref(window.innerWidth / 2)
const clickY = ref(window.innerHeight / 2)

watch(() => props.task, (task) => {
  if (task) {
    formData.value = {
      ...task,
      subtasks: task.subtasks ? [...task.subtasks] : []
    }
  } else {
    resetForm()
  }
}, {immediate: true})

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    description: '',
    status: 'TO_DO',
    priority: 'MEDIUM',
    assignedTo: '',
    subtasks: []
  }
}

const addSubtask = () => {
  formData.value.subtasks.push({
    title: '',
    completed: false
  })
}

const removeSubtask = (index) => {
  formData.value.subtasks.splice(index, 1)
}

const saveTask = async () => {
  if(!formData.value.title) return

  try {
    const response = await fetch('http://localhost:8081/tasks/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        title: formData.value.title,
        description: formData.value.description,
        toDate: null,
        status: formData.value.status,
        priority: formData.value.priority,
        assignedUserId: authStore.user.id,
        teamId: localStorage.getItem('selectedTeam') * 1,
        subtasks: formData.value.subtasks
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się dodać zadania')
    } else {
      closeModal()
      window.location.reload();
    }
  } catch (error) {
    console.error('Błąd dodawania zadania:', error)
  }
}

const closeModal = () => emit('close')

const preventScroll = () => document.body.style.overflow = 'hidden'
const allowScroll = () => document.body.style.overflow = ''

onMounted(() => preventScroll())
onBeforeUnmount(() => allowScroll())

defineExpose({
  setClickPosition(x, y) {
    clickX.value = x
    clickY.value = y
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.3);
}

.modal-enter-to {
  opacity: 1;
  transform: scale(1);
}

.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

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
  background: #f4f4f9;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  background: transparent;
  border: none;
  padding: 0.25rem;
  border-radius: 50%;
  cursor: pointer;
}

.close-button:hover {
  background-color: #f3f4f6;
}

.modal-body {
  padding: 1.25rem 1rem;
  flex: 1;
  display: flex;
}

.modal-body-info {
  width: 55%;
  border-right: 1px solid #e5e7eb;
}

.modal-body-subtasks {
  width: 40%;
  padding-left: 1rem;
  padding-right: 1rem;
}

.modal-body-subtasks p {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  width: 90%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #f9fafb;
}

.form-control:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background: white;
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
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel,
.btn-save {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-save {
  background: #6366f1;
  color: white;
  border: none;
}

.btn-save:hover {
  background: #4f46e5;
}

.subtask-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.subtask-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.subtask-input:focus {
  outline: none;
  border-color: #6366f1;
}

.subtask-remove {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subtask-remove:hover {
  background-color: #fee2e2;
  border-radius: 50%;
}

.btn-add-subtask {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e0e7ff;
  color: #4f46e5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  width: 100%;
}

.btn-add-subtask:hover {
  background-color: #c7d2fe;
}

/* Niestandardowy checkbox */
.custom-checkbox {
  display: inline-block;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 18px;
  margin-right: 0.5rem;
}

.custom-checkbox .subtask-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 2px solid #6366f1;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.custom-checkbox:hover .subtask-checkbox ~ .checkmark {
  background-color: #f3f4f6;
}

.custom-checkbox .subtask-checkbox:checked ~ .checkmark {
  background-color: #6366f1;
  border-color: #6366f1;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox .subtask-checkbox:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
