<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-icon" :class="confirmType">
          <svg v-if="confirmType === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <svg v-else-if="confirmType === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9,12l2,2 4,-4"></path>
          </svg>
        </div>
        <h3>{{ title }}</h3>
      </div>

      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('cancel')">
          Anuluj
        </button>
        <button
            class="btn-confirm"
            :class="confirmType"
            @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Potwierdź'
  },
  confirmType: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'warning'].includes(value)
  }
})

defineEmits(['confirm', 'cancel'])
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
  max-width: 400px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem 1.5rem 1rem;
  text-align: center;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.modal-icon.danger {
  background: #fee2e2;
  color: #dc2626;
}

.modal-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.modal-icon.primary {
  background: #dbeafe;
  color: #2563eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.modal-body {
  padding: 0 1.5rem 1.5rem;
  text-align: center;
}

.modal-body p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-confirm {
  border: none;
  color: white;
}

.btn-confirm.primary {
  background: #3b82f6;
}

.btn-confirm.primary:hover {
  background: #2563eb;
}

.btn-confirm.danger {
  background: #dc2626;
}

.btn-confirm.danger:hover {
  background: #b91c1c;
}

.btn-confirm.warning {
  background: #d97706;
}

.btn-confirm.warning:hover {
  background: #b45309;
}
</style>
