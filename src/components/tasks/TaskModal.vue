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
            <lab>Dodaj podzadania</lab>
            <!--            TODO dodać checkboxy do dodawania podzadań-->
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
  assignedTo: ''
})

const clickX = ref(window.innerWidth / 2)
const clickY = ref(window.innerHeight / 2)

watch(() => props.task, (task) => {
  if (task) formData.value = {...task}
  else resetForm()
}, {immediate: true})

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    description: '',
    status: 'TO_DO',
    priority: 'MEDIUM',
    assignedTo: ''
  }
}

const saveTask = async () => {
  // emit('save', {
  //   ...formData.value
  // })

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
        subtasks: []
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się dodać zadania')
    } else {
      // successMessage.value = 'Dodano zadanie!'
      //await teamStore.fetchTeams()
      //teamStore.setCurrentTeam(teamStore.allTeams[teamStore.allTeams.length-1])
      //console.log(teamStore.allTeams[teamStore.allTeams.length-1].teamName);
      closeModal()
      window.location.reload();
    }
  }  catch (error){
    console.error('Błąd dodawania zadania:', error)
  }
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
</style>
