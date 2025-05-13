<template>
  <div class="dashboard fade-in">
    <div class="card">
      <h1 class="title white-text">Witaj, {{ authStore.user.name }}!</h1>
      <p class="sub-title">Co planujesz dzisiaj zrobić?</p>
    </div>

    <div class="task-grid">
      <div class="task-card">
        <h3 class="task-title">Twoje zadania</h3>
        <p class="task-count">{{ tasksStore.tasks.length }}</p>
      </div>

      <div class="task-card">
        <h3 class="task-title">Zakończone</h3>
        <p class="task-count">
          {{ tasksStore.tasks.filter(t => t.completed).length }}
        </p>
      </div>

      <div class="task-card">
        <h3 class="task-title">W trakcie</h3>
        <p class="task-count">
          {{ tasksStore.tasks.filter(t => !t.completed).length }}
        </p>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 Twój Dashboard</p>
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

.dashboard {
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  background-color: #f4f4f9;
  min-height: 100vh;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: linear-gradient(to right, #e6e0da, #f97316);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 2.25rem;
  font-weight: 600;
}

.white-text {
  color: white;
}

.sub-title {
  color: #fef3c7;
  font-size: 1.125rem;
}

.task-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.task-title {
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #cac0b9;
}

.task-count {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
}

.footer {
  text-align: center;
  margin-top: 3rem;
  color: #888;
}

.footer p {
  font-size: 0.875rem;
}
</style>
