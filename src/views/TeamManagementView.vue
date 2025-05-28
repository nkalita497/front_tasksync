<template>
  <div class="team-management">
    <div class="team-header">
      <div class="header-info">
        <h2>{{ currentTeam?.teamName || 'Zarządzanie zespołem' }}</h2>
        <p v-if="currentTeam?.description" class="team-description">
          {{ currentTeam.description }}
        </p>
      </div>
    </div>

    <div v-if="!currentTeam" class="no-team-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <h3>Wybierz zespół do zarządzania</h3>
      <p>Wybierz zespół z listy powyżej lub utwórz nowy zespół.</p>
    </div>

    <div v-else class="team-content">
      <!-- Statystyki zespołu -->
      <div class="team-stats">
        <div class="stat-card">
          <div class="stat-icon members">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ teamMembers.length }}</h3>
            <p>Członkowie</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon tasks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.67 0 3.22.46 4.56 1.26"></path>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ teamTasks.length }}</h3>
            <p>Zadania</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ completedTasks }}</h3>
            <p>Ukończone</p>
          </div>
        </div>
      </div>

      <!-- Sekcja członków -->
      <div class="members-section">
        <div class="section-header">
          <h2>Członkowie zespołu</h2>
          <button class="add-member-btn" @click="showAddMemberModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="22" y1="11" x2="22" y2="17"></line>
              <line x1="19" y1="14" x2="25" y2="14"></line>
            </svg>
            Dodaj członka
          </button>
        </div>

        <div v-if="loadingMembers" class="loading-state">
          <div class="spinner"></div>
          <p>Ładowanie członków...</p>
        </div>

        <div v-else-if="teamMembers.length === 0" class="empty-members">
          <p>Brak członków w zespole</p>
        </div>

        <div v-else class="members-grid">
          <div v-for="member in teamMembers" :key="member.id" class="member-card">
            <div class="member-avatar">
              <span>{{ getMemberInitials(member) }}</span>
            </div>
            <div class="member-info">
              <h4>{{ member.firstName }} {{ member.lastName }}</h4>
              <p>{{ member.email }}</p>
            </div>
            <div class="member-actions">
              <button class="action-btn edit" @click="editMember(member)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn remove" @click="removeMember(member)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Akcje zespołu -->
      <div class="team-actions-section">
        <!-- Akcje zarządzania -->
        <div class="management-actions">
          <h3>Akcje zespołu</h3>
          <p>Zarządzaj ustawieniami i konfiguracją zespołu.</p>
          <div class="management-buttons">
            <button v-if="currentTeam" class="management-btn edit" @click="editCurrentTeam">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edytuj zespół
            </button>
            <button class="management-btn create" @click="openCreateModal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Utwórz nowy zespół
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Strefa niebezpieczna -->
        <div class="danger-zone">
          <h3>Strefa niebezpieczna</h3>
          <p>Te akcje są nieodwracalne. Zachowaj ostrożność.</p>
          <div class="danger-actions">
            <button class="danger-btn leave" @click="leaveTeam">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Opuść zespół
            </button>
            <button class="danger-btn delete" @click="deleteTeam">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
              </svg>
              Usuń zespół
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateTeamModal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @team-created="handleTeamCreated"
    />

    <EditTeamModal
        v-if="showEditModal"
        :team="currentTeam"
        @close="showEditModal = false"
        @team-updated="handleTeamUpdated"
    />

    <AddMemberModal
        v-if="showAddMemberModal"
        :team-id="currentTeam?.id"
        @close="showAddMemberModal = false"
        @member-added="handleMemberAdded"
    />

    <EditMemberModal
        v-if="showEditMemberModal"
        :member="selectedMember"
        @close="showEditMemberModal = false"
        @member-updated="handleMemberUpdated"
    />

    <ConfirmModal
        v-if="showConfirmModal"
        :title="confirmModal.title"
        :message="confirmModal.message"
        :confirm-text="confirmModal.confirmText"
        :confirm-type="confirmModal.type"
        @confirm="confirmModal.action"
        @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTeamStore } from '@/stores/team'
import { useTasksStore } from '@/stores/tasks'
import CreateTeamModal from '@/components/modals/CreateTeam.vue'
import EditTeamModal from '@/components/teams/EditTeamModal.vue'
import AddMemberModal from '@/components/teams/AddMemberModal.vue'
import EditMemberModal from '@/components/teams/EditMemberModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()
const tasksStore = useTasksStore()

const loadingMembers = ref(false)
const teamMembers = ref([])
const teamTasks = ref([])
const selectedMember = ref(null)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAddMemberModal = ref(false)
const showEditMemberModal = ref(false)
const showConfirmModal = ref(false)

const confirmModal = ref({
  title: '',
  message: '',
  confirmText: '',
  type: 'danger',
  action: null
})

const currentTeam = computed(() => {
  return teamStore.allTeams.find(team => team.id === teamStore.currentTeamId)
})

const completedTasks = computed(() => {
  return teamTasks.value.filter(task => task.status === 'DONE').length
})

const fetchTeamMembers = async () => {
  if (!currentTeam.value) return

  loadingMembers.value = true
  try {
    const response = await fetch(`http://localhost:8081/teams/${currentTeam.value.id}/users`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      teamMembers.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching team members:', error)
  } finally {
    loadingMembers.value = false
  }
}

const fetchTeamTasks = async () => {
  if (!currentTeam.value) return

  try {
    const response = await fetch(`http://localhost:8081/tasks/search-by-team/${currentTeam.value.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      teamTasks.value = await response.json()
    }else {
      teamTasks.value = [];
    }
  } catch (error) {
    console.error('Error fetching team tasks:', error)
  }
}

const getMemberInitials = (member) => {
  const first = member.firstName?.charAt(0) || ''
  const last = member.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const editCurrentTeam = () => {
  showEditModal.value = true
}

const editMember = (member) => {
  selectedMember.value = member
  showEditMemberModal.value = true
}

const removeMember = (member) => {
  confirmModal.value = {
    title: 'Usuń członka',
    message: `Czy na pewno chcesz usunąć ${member.firstName} ${member.lastName} z zespołu?`,
    confirmText: 'Usuń członka',
    type: 'danger',
    action: () => confirmRemoveMember(member.id)
  }
  showConfirmModal.value = true
}

const leaveTeam = () => {
  confirmModal.value = {
    title: 'Opuść zespół',
    message: `Czy na pewno chcesz opuścić zespół "${currentTeam.value.teamName}"?`,
    confirmText: 'Opuść zespół',
    type: 'warning',
    action: () => confirmLeaveTeam()
  }
  showConfirmModal.value = true
}

const deleteTeam = () => {
  confirmModal.value = {
    title: 'Usuń zespół',
    message: `Czy na pewno chcesz usunąć zespół "${currentTeam.value.teamName}"? Ta akcja jest nieodwracalna.`,
    confirmText: 'Usuń zespół',
    type: 'danger',
    action: () => confirmDeleteTeam()
  }
  showConfirmModal.value = true
}

const confirmRemoveMember = async (memberId) => {
  try {
    const response = await fetch(`http://localhost:8081/teams/${currentTeam.value.id}/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      await fetchTeamMembers()
    }
  } catch (error) {
    console.error('Error removing member:', error)
  } finally {
    showConfirmModal.value = false
  }
}

const confirmLeaveTeam = async () => {
  try {
    const response = await fetch(`http://localhost:8081/teams/${currentTeam.value.id}/leave`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      await teamStore.fetchTeams()
      router.push('/tasks')
    }
  } catch (error) {
    console.error('Error leaving team:', error)
  } finally {
    showConfirmModal.value = false
  }
}

const confirmDeleteTeam = async () => {
  try {
    const response = await fetch(`http://localhost:8081/teams/${currentTeam.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      await teamStore.fetchTeams()
      router.push('/tasks')
    }
  } catch (error) {
    console.error('Error deleting team:', error)
  } finally {
    showConfirmModal.value = false
  }
}

const handleTeamCreated = () => {
  showCreateModal.value = false
  teamStore.fetchTeams()
}

const handleTeamUpdated = () => {
  showEditModal.value = false
  teamStore.fetchTeams()
}

const handleMemberAdded = () => {
  showAddMemberModal.value = false
  fetchTeamMembers()
}

const handleMemberUpdated = () => {
  showEditMemberModal.value = false
  fetchTeamMembers()
}

// Watch for team changes
watch(() => teamStore.currentTeamId, () => {
  if (teamStore.currentTeamId) {
    fetchTeamMembers()
    fetchTeamTasks()
  }
}, { immediate: true })

onMounted(() => {
  if (teamStore.currentTeamId) {
    fetchTeamMembers()
    fetchTeamTasks()
  }
})
</script>

<style scoped>
.team-management {
  padding: 0;
  background-color: #f4f4f9;
  min-height: 100vh;
  overflow: hidden;
}

.team-header {
  padding: 15px 30px 20px;
  border-bottom: 1px solid #adb6d2;
}

.team-content {
  padding: 40px;
  height: calc(100vh - 185px);
  overflow-y: scroll;
}

.team-header h2 {
  margin: 0;
  font-size: 30px;
  color: #1e293b;
}

.header-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #1e293b;
}

.team-description {
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 15px;
}


.management-actions {
  margin-bottom: 2rem;
}

.management-actions h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.management-actions p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
}

.management-buttons {
  display: flex;
  gap: 1rem;
}

.management-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.management-btn.edit {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.management-btn.edit:hover {
  background: #e2e8f0;
}

.management-btn.create {
  background: #3b82f6;
  color: white;
}

.management-btn.create:hover {
  background: #2563eb;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 2rem 0;
}

.no-team-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.no-team-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.no-team-state p {
  margin: 0;
  color: #6b7280;
}



.team-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.members {
  background: #d1fae5;
  color: #10b981;
}

.stat-icon.tasks {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-icon.completed {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
}

.stat-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.members-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.add-member-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-member-btn:hover {
  background: #059669;
}

.loading-state {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-members {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s;
}

.member-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.member-info {
  flex: 1;
}

.member-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-size: 1rem;
}

.member-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.edit {
  background: #f1f5f9;
  color: #475569;
}

.action-btn.edit:hover {
  background: #e2e8f0;
}

.action-btn.remove {
  background: #fef2f2;
  color: #ef4444;
}

.action-btn.remove:hover {
  background: #fee2e2;
}

.team-actions-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.danger-zone h3 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-size: 1.25rem;
}

.danger-zone p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

.danger-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.danger-btn.leave {
  background: #fef3c7;
  color: #d97706;
}

.danger-btn.leave:hover {
  background: #fde68a;
}

.danger-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.danger-btn.delete:hover {
  background: #fee2e2;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .team-stats {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }

  .management-buttons,
  .danger-actions {
    flex-direction: column;
  }
}
</style>
