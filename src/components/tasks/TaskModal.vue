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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  task: Object,
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['save', 'close'])

const formData = ref({
  id: null,
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignedTo: ''
})

const clickX = ref(window.innerWidth / 2)
const clickY = ref(window.innerHeight / 2)

watch(() => props.task, (task) => {
  if (task) formData.value = { ...task }
  else resetForm()
}, { immediate: true })

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: ''
  }
}

const saveTask = () => {
  emit('save', {
    ...formData.value,
    id: formData.value.id || Date.now().toString()
  })
  closeModal()
}

const closeModal = () => emit('close')

const preventScroll = () => document.body.style.overflow = 'hidden'
const allowScroll = () => document.body.style.overflow = ''

onMounted(() => preventScroll())
onBeforeUnmount(() => allowScroll())

// Ustaw pozycję kliknięcia z zewnątrz
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
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 460px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
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
  overflow-y: auto;
  flex: 1;
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
  width: 100%;
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
</style>
