<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edytuj członka</h3>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" width="24" height="24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="member-info">
          <div class="member-avatar">
            <span>{{ memberInitials }}</span>
          </div>
          <div class="member-details">
            <h4>{{ member?.firstName }} {{ member?.lastName }}</h4>
            <p>{{ member?.email }}</p>
          </div>
        </div>

        <div class="form-group">
          <input
              v-model="formData.firstName"
              type="text"
              class="form-control"
              placeholder=" "
              required
          />
          <label class="form-label">Imię</label>
        </div>

        <div class="form-group">
          <input
              v-model="formData.lastName"
              type="text"
              class="form-control"
              placeholder=" "
              required
          />
          <label class="form-label">Nazwisko</label>
        </div>

        <div class="form-group">
          <input
              v-model="formData.email"
              type="email"
              class="form-control"
              placeholder=" "
              required
          />
          <label class="form-label">Email</label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">Anuluj</button>
        <button
            class="btn-save"
            @click="updateMember"
            :disabled="!isFormValid || loading"
            :class="{ 'disabled': !isFormValid || loading }"
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
  member: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'member-updated'])
const authStore = useAuthStore()

const formData = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const memberInitials = computed(() => {
  const first = formData.value.firstName?.charAt(0) || ''
  const last = formData.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
})

const isFormValid = computed(() => {
  return formData.value.email &&
      formData.value.firstName &&
      formData.value.lastName
})

// Initialize form with member data
onMounted(() => {
  if (props.member) {
    formData.value.firstName = props.member.firstName || ''
    formData.value.lastName = props.member.lastName || ''
    formData.value.email = props.member.email || ''
  }
})

const updateMember = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(`http://localhost:8081/users/${props.member.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Nie udało się zaktualizować członka')
    }

    successMessage.value = 'Dane członka zostały pomyślnie zaktualizowane!'
    emit('member-updated')

    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (error) {
    console.error('Błąd aktualizacji członka:', error)
    errorMessage.value = error.message || 'Wystąpił błąd podczas aktualizacji danych'
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
  background: #f4f4f9;
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

.member-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.member-details h4 {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
}

.member-details p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.form-group {
  position: relative;
  border: 1px solid #d1d5db;
  padding: 14px 20px 6px;
  border-radius: 3px;
  transition: border-color 0.3s;
  height: 40px;
  margin-bottom: 1rem;
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
  margin-top: 10px;
}

.form-group:focus-within {
  border-color: #1693f9;
  box-shadow: 0 0 0 1px rgba(0, 21, 255, 0.61);
}

.form-control:focus + .form-label,
.form-control:not(:placeholder-shown) + .form-label {
  top: 15px;
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
