<template>
  <div :class="['team-card', viewMode]">
    <div class="team-header">
      <div class="team-info">
        <h3>{{ team.teamName }}</h3>
        <p class="team-description">{{ team.description || 'Brak opisu' }}</p>
      </div>
      <div class="team-actions">
        <button class="action-btn" @click="toggleMenu" ref="menuButton">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
        <div v-if="showMenu" class="action-menu">
          <button @click="$emit('view-details', team)" class="menu-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Zobacz szczegóły
          </button>
          <button @click="$emit('edit-team', team)" class="menu-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edytuj
          </button>
          <div class="menu-divider"></div>
          <button @click="$emit('leave-team', team)" class="menu-item warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Opuść zespół
          </button>
          <button @click="$emit('delete-team', team)" class="menu-item danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
            </svg>
            Usuń zespół
          </button>
        </div>
      </div>
    </div>

    <div class="team-stats">
      <div class="stat">
        <div class="stat-icon members">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ team.memberCount || 0 }}</span>
          <span class="stat-label">Członkowie</span>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon tasks">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.67 0 3.22.46 4.56 1.26"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ team.taskCount || 0 }}</span>
          <span class="stat-label">Zadania</span>
        </div>
      </div>
    </div>

    <div v-if="team.members && team.members.length > 0" class="team-members">
      <div class="members-preview">
        <div
            v-for="(member, index) in team.members.slice(0, 4)"
            :key="member.id"
            class="member-avatar"
            :style="{ zIndex: 4 - index }"
        >
          <span>{{ getMemberInitials(member) }}</span>
        </div>
        <span v-if="team.members.length > 4" class="more-members">
          +{{ team.members.length - 4 }}
        </span>
      </div>
    </div>

    <div class="team-footer">
      <button class="view-details-btn" @click="$emit('view-details', team)">
        Zobacz szczegóły
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7,7 17,7 17,17"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  team: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})

defineEmits(['view-details', 'edit-team', 'delete-team', 'leave-team'])

const showMenu = ref(false)
const menuButton = ref(null)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = (event) => {
  if (menuButton.value && !menuButton.value.contains(event.target)) {
    showMenu.value = false
  }
}

const getMemberInitials = (member) => {
  const first = member.firstName?.charAt(0) || ''
  const last = member.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
.team-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  position: relative;
}

.team-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.team-card.list {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 1.5rem;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.team-card.list .team-header {
  margin-bottom: 0;
  flex: 1;
}

.team-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 600;
}

.team-description {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}

.team-actions {
  position: relative;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  background: #f8fafc;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.action-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-top: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  min-width: 180px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
  text-align: left;
}

.menu-item:hover {
  background: #f8fafc;
}

.menu-item.warning {
  color: #f59e0b;
}

.menu-item.warning:hover {
  background: #fef3c7;
}

.menu-item.danger {
  color: #ef4444;
}

.menu-item.danger:hover {
  background: #fef2f2;
}

.menu-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.25rem 0;
}

.team-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.team-card.list .team-stats {
  margin-bottom: 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
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

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.team-members {
  margin-bottom: 1.5rem;
}

.team-card.list .team-members {
  margin-bottom: 0;
}

.members-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border: 2px solid white;
  margin-left: -8px;
}

.member-avatar:first-child {
  margin-left: 0;
}

.more-members {
  font-size: 0.75rem;
  color: #64748b;
  margin-left: 0.5rem;
}

.team-footer {
  display: flex;
  justify-content: flex-end;
}

.team-card.list .team-footer {
  margin-left: auto;
}

.view-details-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.view-details-btn:hover {
  background: #2563eb;
}

@media (max-width: 768px) {
  .team-card.list {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .team-stats {
    justify-content: space-between;
  }

  .team-footer {
    justify-content: stretch;
  }

  .view-details-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
