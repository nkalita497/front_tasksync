<template>
  <div
      class="task-column"
      :class="columnClass"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleDrop"
  >
    <div class="column-header">
      <h3>{{ title }} <span class="task-count">{{ filteredTasks.length }}</span></h3>
      <button class="add-task" @click="$emit('add-task', status)">+</button>
    </div>
    <div class="task-list">
      <TaskItem
          v-for="(task, index) in filteredTasks"
          :key="task.id"
          :task="task"
          :index="index"
          @task-selected="$emit('task-selected', task)"
      />

      <div v-if="filteredTasks.length === 0" class="empty-state">
        Brak zadań
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted} from 'vue'
import TaskItem from './TaskItem.vue'
import {useTasksStore} from "@/stores/tasks.js";
import {useTeamStore} from "@/stores/team.js";

const taskStore = useTasksStore();
const teamStore = useTeamStore();

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['task-dropped', 'add-task', 'task-selected'])

const filteredTasks = computed(() => {
  console.log(props.tasks)
  console.log(props.status)
  return props.tasks.filter(task => task.status === props.status)
})

// onMounted(async() =>{
//   await taskStore.fetchTasks(teamStore.currentTeamId);
// })


const columnClass = computed(() => `status-${props.status}`)

const handleDrop = (e) => {
  const taskId = e.dataTransfer.getData('taskId')
  emit('task-dropped', { taskId, newStatus: props.status })
}
</script>

<style scoped>
.task-column {
  min-width: 280px;
  width: 280px;
  background: #f4f5f7;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.column-header {
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px solid #adb6d2;
}

.column-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293c;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-count {
  border-radius: 13px;
  border: 1px solid #4d5c75;
  width: 30px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.add-task {
  background: none;
  border: none;
  color: #75849b;
  font-size: 35px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.add-task:hover {
  background: #ebecf0;
  color: #172b4d;
}

.task-list {
  background-color: #d9def1;
  border-radius: 8px;
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.empty-state {
  color: #5e6c84;
  font-size: 0.85rem;
  text-align: center;
  padding: 1rem;
  border-radius: 4px;
}


/* Kolory kolumn */

/*
.status-todo {
  border-top: 4px solid #deebff;
}

.status-in-progress {
  border-top: 4px solid #eae6ff;
}

.status-review {
  border-top: 4px solid #fff0e6;
}

.status-done {
  border-top: 4px solid #e3fcef;
}

 */

</style>