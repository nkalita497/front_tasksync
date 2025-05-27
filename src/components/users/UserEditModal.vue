<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edytuj profil</h3>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" width="24" height="24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="avatar-section">
          <div class="current-avatar">
            <span class="avatar-text">{{ userInitials }}</span>
          </div>
          <div class="avatar-info">
            <h4>{{ fullName }}</h4>
            <p>{{ user.email }}</p>
          </div>
        </div>

        <form @submit.prevent="saveChanges" class="edit-form">
          <div class="form-row">
            <div class="form-group">
              <label>Imię</label>
              <input
                  v-model="formData.firstName"
                  type="text"
                  class="form-control"
                  required
              />
            </div>
            <div class="form-group">
              <label>Nazwisko</label>
              <input
                  v-model="formData.lastName"
                  type="text"
                  class="form-control"
                  required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
                v-model="formData.email"
                type="email"
                class="form-control"
                required
            />
          </div>

          <div class="password-section">
            <h4>Zmiana hasła</h4>
            <p class="password-note">Pozostaw puste, jeśli nie chcesz zmieniać hasła</p>

            <div class="form-group">
              <label>Obecne hasło</label>
              <input
                  v-model="formData.currentPassword"
                  type="password"
                  class="form-control"
                  placeholder="Wprowadź obecne hasło"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Nowe hasło</label>
                <input
                    v-model="formData.newPassword"
                    type="password"
                    class="form-control"
                    placeholder="Nowe hasło"
                />
              </div>
              <div class="form-group">
                <label>Potwierdź hasło</label>
                <input
                    v-model="formData.confirmPassword"
                    type="password"
                    class="form-control"
                    placeholder="Potwierdź nowe hasło"
                />
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="closeModal">
          Anuluj
        </button>
        <button
            type="button"
            class="btn-save"
            @click="saveChanges"
            :disabled="loading"
        >
          {{ loading ? 'Zapisywanie...' : 'Zapisz zmiany' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'user-updated'])

const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userInitials = computed(() => {
  const first = formData.value.firstName?.charAt(0) || ''
  const last = formData.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
})

const fullName = computed(() => {
  return `${formData.value.firstName || ''} ${formData.value.lastName || ''}`.trim() || 'Użytkownik'
})

// Inicjalizuj formularz danymi użytkownika
onMounted(() => {
  watch(() => props.user, (user) => {
    if (user) {
      formData.value.firstName = user.firstName || ''
      formData.value.lastName = user.lastName || ''
      formData.value.email = user.email || ''
    }
  }, { immediate: true })
})

const validateForm = () => {
  errorMessage.value = ''

  if (!formData.value.firstName.trim()) {
    errorMessage.value = 'Imię jest wymagane'
    return false
  }

  if (!formData.value.lastName.trim()) {
    errorMessage.value = 'Nazwisko jest wymagane'
    return false
  }

  if (!formData.value.email.trim()) {
    errorMessage.value = 'Email jest wymagany'
    return false
  }

  // Walidacja hasła jeśli użytkownik chce je zmienić
  if (formData.value.newPassword || formData.value.confirmPassword || formData.value.currentPassword) {
    if (!formData.value.currentPassword) {
      errorMessage.value = 'Wprowadź obecne hasło aby zmienić hasło'
      return false
    }

    if (!formData.value.newPassword) {
      errorMessage.value = 'Wprowadź nowe hasło'
      return false
    }

    if (formData.value.newPassword.length < 6) {
      errorMessage.value = 'Nowe hasło musi mieć co najmniej 6 znaków'
      return false
    }

    if (formData.value.newPassword !== formData.value.confirmPassword) {
      errorMessage.value = 'Hasła nie są identyczne'
      return false
    }
  }

  return true
}

const saveChanges = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Przygotuj dane do wysłania
    const updateData = {
      firstName: formData.value.firstName.trim(),
      lastName: formData.value.lastName.trim(),
      email: formData.value.email.trim()
    }

    // Dodaj dane hasła jeśli użytkownik chce je zmienić
    if (formData.value.currentPassword && formData.value.newPassword) {
      updateData.currentPassword = formData.value.currentPassword
      updateData.newPassword = formData.value.newPassword
    }

    const response = await fetch('http://localhost:8081/users/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się zaktualizować profilu')
    }

    successMessage.value = 'Profil został pomyślnie zaktualizowany!'

    // Wyczyść pola hasła
    formData.value.currentPassword = ''
    formData.value.newPassword = ''
    formData.value.confirmPassword = ''

    // Odśwież dane użytkownika w store
    await authStore.me()
    emit('user-updated')

    // Zamknij modal po 1.5 sekundy
    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (error) {
    console.error('Błąd aktualizacji profilu:', error)
    errorMessage.value = error.message || 'Wystąpił błąd podczas aktualizacji profilu'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
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
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #475569;
}

.modal-body {
  padding: 2rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 8px;
}

.current-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
}

.avatar-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  color: #1e293b;
}

.avatar-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.password-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #1e293b;
}

.password-note {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-save {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-save:hover:not(:disabled) {
  background: #2563eb;
}

.btn-save:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
}

.success-message {
  color: #16a34a;
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .form-row {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}
</style>
