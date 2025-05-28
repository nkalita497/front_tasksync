<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Stwórz nowy zespół</h3>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="form-group">

          <input
              v-model="formData.teamName"
              class="form-control"
              placeholder=" "
              required
          />
          <label class="form-label">Nazwa zespołu</label>
        </div>

        <div class="form-group textarea-group">

          <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder=" "
          ></textarea>
          <label class="form-label">Opis (opcjonalny)</label>
        </div>

        <!-- Usunięto sekcję z członkami, ponieważ backend tego nie obsługuje -->
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Anuluj</button>
        <button
            class="btn-save"
            @click="createTeam"
            :disabled="!formData.teamName || loading"
            :class="{ 'disabled': !formData.teamName || loading }"
        >
          {{ loading ? 'Tworzenie...' : 'Utwórz zespół' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTeamStore } from '/src/stores/team.js'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close', 'team-created'])
const teamStore = useTeamStore()
const authStore = useAuthStore()

const formData = ref({
  teamName: '',
  description: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const createTeam = async () => {
  if (!formData.value.teamName) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch('http://localhost:8081/teams/create-team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        teamName: formData.value.teamName,
        description: formData.value.description,
        userIds: []
        // Nie wysyłamy już userIds, ponieważ backend tego nie obsługuje
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się utworzyć zespołu')
    }else{
      successMessage.value = 'Zespół został pomyślnie utworzony!'

      await teamStore.fetchTeams()
      // teamStore.setCurrentTeam(teamStore.allTeams[teamStore.allTeams.length-1])
      // console.log(teamStore.allTeams[teamStore.allTeams.length-1].teamName);

      // console.log(teamStore.allTeams)
      // const index = teamStore.allTeams[teamStore.allTeams.length-1];
      // const newTeamId = teamStore.allTeams[index];
      // console.log("a" + newTeamId);
      // console.log("Hello")

      emit('close');
      window.location.reload();

    }
    //
    // setTimeout(() => {
    //   emit('close')
    // }, 1500)

  } catch (error) {
    console.error('Błąd tworzenia zespołu:', error)
    errorMessage.value =  'Wystąpił błąd podczas tworzenia zespołu'
  } finally {
    loading.value = false
  }
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
  background: #f4f4f9;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  line-height: 1;
  padding: 0.25rem;
}

.close-button:hover {
  color: #475569;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  position: relative;
  border: 1px solid #d1d5db;
  padding: 14px 20px 6px;
  border-radius: 3px;
  transition: border-color 0.3s;
  height: 40px;
}

.textarea-group{
  height: auto;
  max-width: 100%;
}

.form-label {
  position: absolute;
  font-size: 1rem;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  transition: all 0.2s ease-out;
  padding: 0 0 0 9px;
  color: #999;
  pointer-events: none;
}

.form-control {
  width: 100%;
  border: none;
  outline: none;
  box-shadow: none;
  font-size: 16px;
  padding: 6px 0;
  background: transparent;
  margin-top: 10px; /* im większy tym niżej będzie input */
}

.form-group:focus-within {
  border-color: #1693f9;
  box-shadow: 0 0 0 1px rgba(0, 21, 255, 0.61);
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: none;
}

.form-control:focus + .form-label,
.form-control:not(:placeholder-shown) + .form-label{
  top: 15px; /*im mniejsze tym wyżej będzie label po kliknięciu */
  left: 10px;
  font-size: 12px;
}



.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel, .btn-save {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-save {
  background: #3b82f6;
  border: none;
  color: white;
}

.btn-save:hover:not(.disabled) {
  background: #2563eb;
}

.btn-save.disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 6px;
}

.success-message {
  color: #16a34a;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border-radius: 6px;
}
</style>