import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref([])

    function addTask(task) {
        tasks.value.push(task)
    }

    function toggleTask(id) {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
            task.completed = !task.completed
        }
    }

    function updateTask(updatedTask) {
        const index = tasks.value.findIndex(t => t.id === updatedTask.id)
        if (index !== -1) {
            tasks.value[index] = updatedTask
        }
    }

    function deleteTask(id) {
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    return {
        tasks,
        addTask,
        toggleTask,
        updateTask,
        deleteTask
    }
})