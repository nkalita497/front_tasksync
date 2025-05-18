<template>
  <div class="team-form-container">
    <h2 class="form-title">Dodaj nowy zespół</h2>
    <form @submit.prevent="submitForm" class="team-form">
      <div class="form-group">
        <label for="teamName" class="form-label">Nazwa zespołu:</label>
        <input
            v-model="formData.teamName"
            id="teamName"
            type="text"
            class="form-input"
            required
            placeholder="Wprowadź nazwę zespołu"
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Opis:</label>
        <textarea
            v-model="formData.description"
            id="description"
            class="form-input"
            rows="3"
            placeholder="Wprowadź opis zespołu"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="userIds" class="form-label">ID użytkowników (oddzielone przecinkami):</label>
        <input
            v-model="formData.userIds"
            id="userIds"
            type="text"
            class="form-input"
            placeholder="np. 1,2,3"
        />
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? 'Przetwarzanie...' : 'Dodaj zespół' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  teamName: '',
  description: '',
  userIds: ''
})

const submitForm = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    // Konwertuj string userIds na tablicę liczb
    const userIdsArray = formData.value.userIds
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))

    const response = await fetch('http://localhost:8081/teams/create-team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        teamName: formData.value.teamName,
        description: formData.value.description,
        userIds: userIdsArray
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się dodać zespołu')
    }

    successMessage.value = 'Zespół został pomyślnie dodany!'
    formData.value = { teamName: '', description: '', userIds: '' }
  } catch (error) {
    errorMessage.value = error.message || 'Wystąpił błąd podczas dodawania zespołu'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.team-form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  color: #1693f9;
  margin-bottom: 1.5rem;
  text-align: center;
}

.team-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-label {
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #1693f9;
  box-shadow: 0 0 0 2px rgba(22, 147, 249, 0.2);
}

textarea.form-input {
  min-height: 80px;
  resize: vertical;
}

.submit-button {
  padding: 0.75rem;
  background-color: #1693f9;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #1281e0;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  text-align: center;
}

.success-message {
  color: #16a34a;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  text-align: center;
}
</style>