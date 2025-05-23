<template>
  <div class="profile-container">
    <div class="profile-info">
      <h2 class="profile-name">{{ user.name }}</h2>
      <p class="profile-email">{{ user.email }}</p>
    </div>

    <div class="teams-section">
      <div class="teams-header">
        <h3>Zespoły</h3>
        <button @click="showAddTeamModal = true" class="add-team-button">+ Dodaj zespół</button>
      </div>

      <div v-if="loadingTeams" class="loading-message">Ładowanie zespołów...</div>
      <div v-else-if="userTeams.length === 0" class="empty-message">Brak przypisanych zespołów</div>
      <ul v-else class="teams-list">
        <li v-for="team in userTeams" :key="team.id" class="team-item">
          <span>{{ team.teamName }}</span>
          <button @click="removeFromTeam(team.id)" class="remove-button" title="Usuń z zespołu">
            ×
          </button>
        </li>
      </ul>
    </div>

    <AddTeamModal
        v-if="showAddTeamModal"
        :userId="user.id"
        @close="showAddTeamModal = false"
        @team-added="fetchUserTeams"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddTeamModal from './AddTeamModal.vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const userTeams = ref([])
const loadingTeams = ref(false)
const showAddTeamModal = ref(false)

onMounted(() => {
  fetchUserTeams()
})

const fetchUserTeams = async () => {
  try {
    loadingTeams.value = true
    const response = await fetch(`http://localhost:8081/teams/user/${props.user.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) throw new Error('Failed to fetch teams')
    userTeams.value = await response.json()
  } catch (error) {
    console.error('Error fetching teams:', error)
  } finally {
    loadingTeams.value = false
  }
}

const removeFromTeam = async (teamId) => {
  if (!confirm('Czy na pewno chcesz usunąć użytkownika z tego zespołu?')) return

  try {
    const response = await fetch(`http://localhost:8081/teams/${teamId}/remove-user/${props.user.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) throw new Error('Failed to remove user from team')
    fetchUserTeams()
  } catch (error) {
    console.error('Error removing user from team:', error)
    alert('Nie udało się usunąć użytkownika z zespołu')
  }
}
</script>

<style scoped>
.profile-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 1.5rem auto;
}

.profile-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.profile-email {
  font-size: 1rem;
  color: #4b5563;
}

.teams-section {
  margin-top: 1.5rem;
}

.teams-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.teams-header h3 {
  font-size: 1.1rem;
  color: #374151;
  margin: 0;
}

.add-team-button {
  background-color: #1693f9;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-team-button:hover {
  background-color: #1281e0;
}

.teams-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #f9fafb;
}

.remove-button {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
  line-height: 1;
}

.remove-button:hover {
  color: #dc2626;
}

.loading-message, .empty-message {
  text-align: center;
  color: #6b7280;
  padding: 1rem;
}
</style>