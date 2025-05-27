<template>
  <div class="board">
    <h1>Tablica Kanban</h1>
    <div class="board-columns">
      <TaskColumn
          v-for="status in statuses"
          :key="status"
          :status="status"
          :tasks="tasks.filter(task => task.status === status)"
          @open-task-modal="openTaskModal"
      />
    </div>

    <div v-if="selectedTask" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeTaskModal">&times;</span>
        <h2>{{ selectedTask.title }}</h2>
        <p>{{ selectedTask.description }}</p>
        <label for="status">Status:</label>
        <select id="status" v-model="selectedTask.status">
          <option v-for="status in statuses" :key="status" :value="status">
            {{ statusLabels[status] }}
          </option>
        </select>
        <button @click="saveTask">Zapisz</button>
      </div>
    </div>

    <div v-if="newTaskModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeNewTaskModal">&times;</span>
        <h2>Nowe Zadanie</h2>
        <label for="title">Tytuł:</label>
        <input type="text" id="title" v-model="newTask.title" />
        <label for="description">Opis:</label>
        <textarea id="description" v-model="newTask.description"></textarea>
        <label for="status">Status:</label>
        <select id="status" v-model="newTask.status">
          <option v-for="status in statuses" :key="status" :value="status">
            {{ statusLabels[status] }}
          </option>
        </select>
        <button @click="addTask">Dodaj</button>
      </div>
    </div>

    <button @click="openNewTaskModal">Dodaj nowe zadanie</button>
  </div>
</template>

<script>
import TaskColumn from '../components/TaskColumn.vue';

export default {
  components: {
    TaskColumn
  },
  data() {
    return {
      statuses: ['TO_DO', 'IN_PROGRESS', 'DONE'],
      statusLabels: {
        'TO_DO': 'Do zrobienia',
        'IN_PROGRESS': 'W trakcie',
        'DONE': 'Zrobione'
      },
      tasks: [
        { id: 1, title: 'Zadanie 1', description: 'Opis zadania 1', status: 'TO_DO' },
        { id: 2, title: 'Zadanie 2', description: 'Opis zadania 2', status: 'IN_PROGRESS' },
        { id: 3, title: 'Zadanie 3', description: 'Opis zadania 3', status: 'DONE' },
        { id: 4, title: 'Zadanie 4', description: 'Opis zadania 4', status: 'TO_DO' }
      ],
      selectedTask: null,
      newTaskModalOpen: false,
      newTask: {
        title: '',
        description: '',
        status: 'TO_DO'
      }
    }
  },
  methods: {
    openTaskModal(task) {
      this.selectedTask = task;
    },
    closeTaskModal() {
      this.selectedTask = null;
    },
    saveTask() {
      this.closeTaskModal();
    },
    openNewTaskModal() {
      this.newTaskModalOpen = true;
    },
    closeNewTaskModal() {
      this.newTaskModalOpen = false;
      this.newTask = {
        title: '',
        description: '',
        status: 'TO_DO'
      };
    },
    addTask() {
      const newTask = {
        id: Date.now(),
        title: this.newTask.title,
        description: this.newTask.description,
        status: this.newTask.status
      };
      this.tasks.push(newTask);
      this.closeNewTaskModal();
    }
  }
}
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.board-columns {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

label {
  display: block;
  margin-top: 10px;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3e8e41;
}
</style>