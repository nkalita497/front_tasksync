<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Nowy zespół</h3>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="form-group">
          <label>Nazwa zespołu:</label>
          <input
              v-model="formData.teamName"
              class="form-control"
              placeholder="Nazwa zespołu"
              required
          />
        </div>

        <div class="form-group">
          <label>Opis (opcjonalny):</label>
          <textarea
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Krótki opis zespołu"
          ></textarea>
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
        description: formData.value.description
        // Nie wysyłamy już userIds, ponieważ backend tego nie obsługuje
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się utworzyć zespołu')
    }

    const newTeam = await response.json()
    successMessage.value = 'Zespół został pomyślnie utworzony!'

    await teamStore.fetchTeams()
    teamStore.setCurrentTeam(newTeam.id)

    setTimeout(() => {
      emit('team-created', newTeam)
      emit('close')
    }, 1500)
  } catch (error) {
    console.error('Błąd tworzenia zespołu:', error)
    errorMessage.value = error.message || 'Wystąpił błąd podczas tworzenia zespołu'
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
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
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
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

textarea.form-control {
  min-height: 80px;
  resize: vertical;
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