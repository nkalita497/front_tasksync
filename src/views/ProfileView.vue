<template>
  <div class="profile-view">
    <div class="profile-header">
      <h1>Mój profil</h1>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="profile-avatar-section">
          <div class="profile-avatar">
            <span class="avatar-text">{{ userInitials }}</span>
          </div>
          <div class="profile-info">
            <h2>{{ fullName }}</h2>
            <p class="profile-email">{{ authStore.user?.email }}</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-number">{{ userTeams.length }}</span>
                <span class="stat-label">Zespoły</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ userTasks.length }}</span>
                <span class="stat-label">Zadania</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-sections">
        <div class="section">
          <h3>Moje zespoły</h3>
          <div v-if="loadingTeams" class="loading">Ładowanie...</div>
          <div v-else-if="userTeams.length === 0" class="empty-state">
            <p>Nie należysz do żadnego zespołu</p>
          </div>
          <div v-else class="teams-grid">
            <div v-for="team in userTeams" :key="team.id" class="team-card">
              <h4>{{ team.teamName }}</h4>
              <p>{{ team.description || 'Brak opisu' }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Moje zadania</h3>
          <div v-if="loadingTasks" class="loading">Ładowanie...</div>
          <div v-else-if="userTasks.length === 0" class="empty-state">
            <p>Nie masz przypisanych zadań</p>
          </div>
          <div v-else class="tasks-list">
            <div v-for="task in userTasks" :key="task.id" class="task-item">
              <div class="task-info">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
              </div>
              <div class="task-meta">
                <span class="task-status" :class="'status-' + task.status.toLowerCase()">
                  {{ getStatusLabel(task.status) }}
                </span>
                <span class="task-priority" :class="'priority-' + task.priority.toLowerCase()">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Przycisk edytuj profil na dole -->
      <div class="profile-actions">
        <button class="edit-profile-button" @click="showEditModal = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edytuj profil
        </button>
      </div>
    </div>

    <UserEditModal
        v-if="showEditModal"
        :user="authStore.user"
        @close="showEditModal = false"
        @user-updated="handleUserUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserEditModal from '@/components/users/UserEditModal.vue'

const authStore = useAuthStore()

const showEditModal = ref(false)
const userTeams = ref([])
const userTasks = ref([])
const loadingTeams = ref(false)
const loadingTasks = ref(false)

const userInitials = computed(() => {
  const user = authStore.user
  if (!user) return 'U'
  const first = user.firstName?.charAt(0) || ''
  const last = user.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
})

const fullName = computed(() => {
  const user = authStore.user
  if (!user) return 'Użytkownik'
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Użytkownik'
})

const fetchUserTeams = async () => {
  if (!authStore.user?.id) return

  try {
    loadingTeams.value = true
    const response = await fetch(`http://localhost:8081/teams`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      userTeams.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching teams:', error)
  } finally {
    loadingTeams.value = false
  }
}

const fetchUserTasks = async () => {
  if (!authStore.user?.id) return

  try {
    loadingTasks.value = true
    const response = await fetch(`http://localhost:8081/tasks/search-assigned`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      userTasks.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    loadingTasks.value = false
  }
}

const getStatusLabel = (status) => {
  const labels = {
    'TO_DO': 'Do zrobienia',
    'IN_PROGRESS': 'W trakcie',
    'DONE': 'Zrobione'
  }
  return labels[status] || status
}

const getPriorityLabel = (priority) => {
  const labels = {
    'LOW': 'Niski',
    'MEDIUM': 'Średni',
    'HIGH': 'Wysoki'
  }
  return labels[priority] || priority
}

const handleUserUpdate = () => {
  authStore.me()
}

onMounted(async () => {
  await authStore.me()
  fetchUserTeams()
  fetchUserTasks()
})
</script>

<style scoped>
.profile-view {
  padding: 0;
  background-color: #f4f4f9;
  min-height: 100vh;
}

.profile-header {
  padding: 30px 30px 35.5px;
  border-bottom: 1px solid #adb6d2;
}

.profile-header h1 {
  margin: 0;
  font-size: 30px;
  color: #1e293b;
}

.profile-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
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
  font-size: 2rem;
}

.profile-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #1e293b;
}

.profile-email {
  margin: 0 0 1.5rem 0;
  color: #64748b;
  font-size: 1.125rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.profile-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.teams-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.team-card h4 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.team-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.task-info h4 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.task-info p {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
}

.task-status,
.task-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-to_do {
  background: #f1f5f9;
  color: #475569;
}

.status-in_progress {
  background: #fef3c7;
  color: #92400e;
}

.status-done {
  background: #d1fae5;
  color: #065f46;
}

.priority-low {
  background: #d1fae5;
  color: #065f46;
}

.priority-medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-high {
  background: #fee2e2;
  color: #991b1b;
}

.loading,
.empty-state {
  text-align: center;
  color: #64748b;
  padding: 2rem;
}

/* Nowa sekcja z przyciskiem na dole */
.profile-actions {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.edit-profile-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.edit-profile-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.edit-profile-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .profile-sections {
    grid-template-columns: 1fr;
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .profile-stats {
    justify-content: center;
  }

  .profile-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .edit-profile-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
