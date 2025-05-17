<template>
  <div class="dashboard fade-in">
    <nav class="navbar">
      <div class="nav-item active">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </div>
      <div class="nav-item">
        <i class="fas fa-tasks"></i>
        <span>Zadania</span>
      </div>
      <div class="nav-item">
        <i class="fas fa-cog"></i>
        <span>Ustawienia</span>
      </div>
    </nav>

    <div class="main-content">
      <div class="welcome-card">
        <h1 class="title white-text">Witaj, {{ authStore.user.name }}!</h1>
        <p class="sub-title">Co planujesz dzisiaj zrobić?</p>
      </div>

      <div class="task-grid">
        <div class="task-card task-card-primary">
          <h3 class="task-title">Twoje zadania</h3>
          <p class="task-count">{{ tasksStore.tasks.length }}</p>
        </div>

        <div class="task-card task-card-success">
          <h3 class="task-title">Zakończone</h3>
          <p class="task-count">
            {{ tasksStore.tasks.filter(t => t.completed).length }}
          </p>
        </div>

        <div class="task-card task-card-warning">
          <h3 class="task-title">W trakcie</h3>
          <p class="task-count">
            {{ tasksStore.tasks.filter(t => !t.completed).length }}
          </p>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn btn-primary">
          <i class="fas fa-plus"></i> Nowe zadanie
        </button>
        <button class="action-btn btn-secondary">
          <i class="fas fa-calendar"></i> Kalendarz
        </button>
      </div>

      <div class="footer">
        <p>© 2025 Twój Dashboard</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'

const authStore = useAuthStore()
const tasksStore = useTasksStore()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.dashboard {
  font-family: 'Poppins', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Nawigacja */
.navbar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 10px rgba(59, 130, 246, 0.1);
  padding: 2rem 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item i {
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: #3b82f6;
}

.nav-item.active {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

/* Główna zawartość */
.main-content {
  flex: 1;
  padding: 2rem;
}

.welcome-card {
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
}

.title {
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.white-text {
  color: white;
}

.sub-title {
  color: #e0e7ff;
  font-size: 1.125rem;
}

/* Karty zadań */
.task-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .task-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.task-card {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.task-card:hover {
  transform: translateY(-5px);
}

.task-card-primary {
  border-top: 4px solid #3b82f6;
}

.task-card-success {
  border-top: 4px solid #10b981;
}

.task-card-warning {
  border-top: 4px solid #f59e0b;
}

.task-title {
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #64748b;
}

.task-count {
  font-size: 3rem;
  font-weight: 700;
  color: #1e40af;
}

/* Przyciski akcji */
.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-secondary:hover {
  background-color: #f1f5f9;
}

/* Stopka */
.footer {
  text-align: center;
  margin-top: 3rem;
  color: #94a3b8;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.footer p {
  font-size: 0.875rem;
}
</style>