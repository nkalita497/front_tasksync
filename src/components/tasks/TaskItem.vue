<template>
  <div class="task-item" :class="{ 'completed': task.completed }">
    <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle', task.id)"
        class="task-checkbox"
    >
    <div class="task-content">
      <h3 class="task-title">{{ task.title }}</h3>
      <p v-if="task.description" class="task-description">{{ task.description }}</p>
      <div v-if="task.date || task.time" class="task-meta">
        <span v-if="task.date" class="task-date">{{ formatDate(task.date) }}</span>
        <span v-if="task.time" class="task-time">{{ task.time }}</span>
      </div>
    </div>
    <button @click="$emit('delete', task.id)" class="delete-button">×</button>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'delete'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pl-PL')
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #6b7280;
}

.task-checkbox {
  margin-top: 0.3rem;
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0;
  font-size: 1rem;
  color: #1f2937;
}

.task-description {
  margin: 0.5rem 0 0;
  color: #4b5563;
  font-size: 0.9rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.delete-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ef4444;
  cursor: pointer;
  padding: 0 0.5rem;
  line-height: 1;
}

.delete-button:hover {
  color: #dc2626;
}
</style>