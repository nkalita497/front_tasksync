<template>
  <div class="task-list">
    <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
    />
    <div v-if="tasks.length === 0" class="empty-message">
      Brak zadań do wyświetlenia
    </div>
  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue'

defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['toggle', 'delete'])
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}
</style>