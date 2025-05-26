<template>
  <div
      class="task-item"
      :class="[{'dragging': isDragging }]"
      draggable="true"
      @dragstart="startDrag"
      @dragend="isDragging = false"
      @click="selectTask"
  >
    <div class="task-header">
      <span class="task-key">{{ taskKey }}</span>
      <span class="task-type">{{ task.type || 'Task' }}</span>
    </div>
    <h4 class="task-title">{{ task.title }}</h4>
    <div class="task-footer">
      <span class="task-priority" :class="'priority-' + task.priority">
        {{ priorityLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['task-selected'])

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  index: Number
})

const isDragging = ref(false)

const taskKey = computed(() => `TASK-${props.index + 1}`)
const priorityLabel = computed(() => {
  const priorities = {
    LOW: 'Niski',
    MEDIUM: 'Średni',
    HIGH: 'Wysoki',
  }
  return priorities[props.task.priority] || props.task.priority
})

const startDrag = (e) => {
  isDragging.value = true
  e.dataTransfer.setData('taskId', props.task.id)
  e.dataTransfer.effectAllowed = 'move'
}

const selectTask = () => {
  emit('task-selected', props.task)
}
</script>


<style scoped>
.task-item {
  background: white;
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 2px 4px 0 rgba(9, 30, 66, 0.1);
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.task-item:hover {
  background: #f4f5f7;
  box-shadow: 0 3px 5px rgba(9, 30, 66, 0.1);
}

.task-item.dragging {
  opacity: 0.5;
  background: #ebecf0;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.task-key {
  font-size: 0.75rem;
  color: #5e6c84;
}

.task-type {
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  background: #dfe1e6;
  color: #42526e;
}

.task-title {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: #172b4d;
  font-weight: 500;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-priority {
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.priority-low {
  background: #e3fcef;
  color: #064;
}

.priority-medium {
  background: #deebff;
  color: #0747a6;
}

.priority-high {
  background: #ffebe6;
  color: #bf2600;
}



.task-bug {
  border-left-color: #ff5630;
}

.task-story {
  border-left-color: #6554c0;
}

.task-task {
  border-left-color: #4c9aff;
}
</style>