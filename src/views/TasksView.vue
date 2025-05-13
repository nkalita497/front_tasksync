<template>
  <div class="app-container">
    <!-- Oś czasu zadań -->
    <div class="timeline-view">
      <div class="timeline-header">
        <h2>Oś czasu zadań</h2>
        <div class="timeline-nav">
          <button @click="prevWeek">&lt;</button>
          <h3>{{ currentWeekRange }}</h3>
          <button @click="nextWeek">&gt;</button>
        </div>
      </div>

      <div class="timeline-days">
        <div
            v-for="day in weekDays"
            :key="day.date.toString()"
            :class="['timeline-day', { 'today': day.isToday, 'active': day.isActive }]"
            @click="selectDay(day)"
        >
          <div class="day-name">{{ day.dayName }}</div>
          <div class="day-date">{{ day.dayNumber }}</div>
          <div v-if="day.taskCount > 0" class="day-tasks">
            {{ day.taskCount }} {{ day.taskCount === 1 ? 'zadanie' : 'zadań' }}
          </div>
        </div>
      </div>

      <div class="timeline-tasks">
        <div v-if="selectedDayTasks.length > 0" class="tasks-list">
          <div v-for="task in selectedDayTasks" :key="task.id" class="task-item">
            <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)">
            <span :class="{ 'completed': task.completed }">{{ task.title }}</span>
            <span class="task-time">{{ formatTaskTime(task) }}</span>
          </div>
        </div>
        <div v-else class="no-tasks">
          Brak zadań na wybrany dzień
        </div>
      </div>
    </div>

    <!-- Główny kontener zadań -->
    <div class="task-container">
      <div class="header">
        <h1 class="title">Twoje zadania</h1>
        <button @click="showForm = !showForm" class="toggle-button">
          {{ showForm ? 'Anuluj' : '+ Nowe zadanie' }}
        </button>
      </div>

      <TaskForm
          v-if="showForm"
          @added="handleTaskAdded"
          @cancel="showForm = false"
          class="task-form"
      />

      <div v-if="filteredTasks.length > 0" class="task-list">
        <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="task-item"
            :class="{ 'completed': task.completed }"
        >
          <input
              type="checkbox"
              :checked="task.completed"
              @change="toggleTask(task.id)"
          >
          <div class="task-content">
            <h3>{{ task.title }}</h3>
            <p v-if="task.description">{{ task.description }}</p>
            <div class="task-meta">
              <span v-if="task.date">{{ formatDate(task.date) }}</span>
              <span v-if="task.time">{{ task.time }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-tasks">
        Brak zadań. Dodaj nowe!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import TaskForm from '@/components/tasks/TaskForm.vue'

const tasksStore = useTasksStore()
const showForm = ref(false)
const currentDate = ref(new Date())
const selectedDate = ref(new Date())

// Generuj dni tygodnia
const weekDays = computed(() => {
  const days = []
  const startOfWeek = new Date(currentDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // Start od poniedziałku

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek)
    dayDate.setDate(startOfWeek.getDate() + i)

    const isToday = isSameDay(dayDate, new Date())
    const isActive = isSameDay(dayDate, selectedDate.value)

    const tasksForDay = tasksStore.tasks.filter(task => {
      if (!task.date) return false
      return isSameDay(new Date(task.date), dayDate)
    })

    days.push({
      date: dayDate,
      dayName: dayDate.toLocaleDateString('pl-PL', { weekday: 'short' }),
      dayNumber: dayDate.getDate(),
      isToday,
      isActive,
      taskCount: tasksForDay.length
    })
  }

  return days
})

// Zakres dat dla nagłówka
const currentWeekRange = computed(() => {
  const start = weekDays.value[0].date
  const end = weekDays.value[6].date

  return `${start.getDate()} ${start.toLocaleDateString('pl-PL', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('pl-PL', { month: 'short' })} ${end.getFullYear()}`
})

// Zadania dla wybranego dnia
const selectedDayTasks = computed(() => {
  return tasksStore.tasks.filter(task => {
    if (!task.date) return false
    return isSameDay(new Date(task.date), selectedDate.value)
  })
})

// Filtrowane zadania (do głównej listy)
const filteredTasks = computed(() => {
  return [...tasksStore.tasks].sort((a, b) => a.completed - b.completed)
})

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
}

function selectDay(day) {
  selectedDate.value = new Date(day.date)
}

function prevWeek() {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 7)
  currentDate.value = newDate
}

function nextWeek() {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 7)
  currentDate.value = newDate
}

function toggleTask(id) {
  tasksStore.toggleTask(id)
}

function formatTaskTime(task) {
  if (!task.time) return ''
  return task.time
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pl-PL')
}

function handleTaskAdded() {
  showForm.value = false
  // Wymuszamy aktualizację danych
  currentDate.value = new Date(currentDate.value)
}
</script>

<style>
.app-container {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
}

.timeline-view {
  flex: 1;
  max-width: 350px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.timeline-header {
  margin-bottom: 1rem;
}

.timeline-header h2 {
  font-size: 1.25rem;
  color: #f97316;
  margin-bottom: 0.5rem;
}

.timeline-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.timeline-nav button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #f97316;
  padding: 0.5rem;
}

.timeline-nav h3 {
  font-size: 1rem;
  font-weight: 500;
}

.timeline-days {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.timeline-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeline-day:hover {
  background-color: #f3f4f6;
}

.timeline-day.active {
  background-color: #f97316;
  color: white;
}

.day-name {
  font-size: 0.8rem;
  text-transform: capitalize;
}

.day-date {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.25rem 0;
}

.day-tasks {
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 0.1rem 0.4rem;
}

.timeline-day.active .day-tasks {
  background: rgba(255, 255, 255, 0.3);
}

.timeline-day.today:not(.active) {
  border: 2px solid #f97316;
}

.timeline-tasks {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: #f8f9fa;
}

.task-item.completed {
  opacity: 0.7;
  text-decoration: line-through;
}

.task-item input {
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.no-tasks {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
}

/* Stylizacja głównego kontenera zadań */
.task-container {
  flex: 2;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f97316;
}

.toggle-button {
  background-color: #f97316;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: #ea580c;
}

.task-form {
  margin-bottom: 1.5rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsywność */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .timeline-view {
    max-width: 100%;
    order: -1;
    margin-bottom: 1.5rem;
  }
}
</style>