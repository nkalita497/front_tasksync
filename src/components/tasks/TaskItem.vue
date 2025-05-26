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
      <h4 class="task-title">{{ task.title }}</h4>
      <span class="task-priority" :class="'priority-' + task.priority">
        {{ priorityLabel }}
      </span>
    </div>

    <h3 class="task-descr"> {{ task.description }}</h3>
    <div class="progress-wrap" v-if="task.subtasks.length>0">
      <div class="progress-info-wrap">
        <p>Podzadania</p>
        <p>{{ doneSubtasks }}/{{ task.subtasks.length }}</p>
      </div>

      <div class="progress-bar">
        <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

    </div>

    <div class="task-footer">
<!--    <div class="user-wrap">-->
<!--      <div></div>-->
<!--      <p>User name</p>-->
<!--    </div>-->
        <img src="../../assets/removeIcon.svg" width="17px" alt="delete" v-on:click.stop="removeTask(task.id)"/>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useAuthStore} from "@/stores/auth.js";
import {useTasksStore} from "@/stores/tasks.js";


const tasksStore = useTasksStore();
const authStore = useAuthStore();

const emit = defineEmits(['task-selected'])

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  index: Number
})

const doneSubtasks = computed(() => {
  return props.task.subtasks.filter(subtask => {
    return subtask.status === true;
  }).length;
})


const isDragging = ref(false)

const taskKey = computed(() => `TASK-${props.index + 1}`)
const priorityLabel = computed(() => {
  const priorities = {
    LOW: ' ',
    MEDIUM: ' ',
    HIGH: ' ',
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

const removeTask = (id) =>{
  const res = tasksStore.deleteTask(id);
    window.location.reload()
}

const completedSubtasks = computed(() => doneSubtasks.value || 0)
const totalSubtasks = computed(() => props.task.subtasks.length || 0)

const progressPercentage = computed(() => {
  if (totalSubtasks.value === 0) return 0
  return Math.round((completedSubtasks.value / totalSubtasks.value) * 100)
})



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
  font-size: 1rem;
  color: #172b4d;
  font-weight: 500;
}

.task-descr {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: #32486e;
  font-weight: 300;
  margin-bottom: 30px;
}

.task-footer {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.task-priority {
  width: 2px;
  height: 7px;
  font-size: 0.75rem;
  padding: 0.3rem 0.5rem;
  border-radius: 20px;
}

.priority-LOW {
  background: #9fe1b3;
  color: #064;
}

.priority-MEDIUM {
  background: #f3e585;
  color: #cb9b13;
}

.priority-HIGH {
  background: #e59889;
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


.progress-info-wrap {
  display: flex;
  justify-content: space-between
}

.progress-info-wrap p{
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: #32486e;
  font-weight: 400;
}


.subtask-progress {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #4b5563;
}



.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 18px;
}

.progress-fill {
  height: 100%;
  background-color: #0d7efc; /* niebieski */
  transition: width 0.3s ease;
}
</style>