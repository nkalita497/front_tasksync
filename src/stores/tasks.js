import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref([
        // {
        //     id: '1',
        //     type: 'Story',
        //     title: 'Implementacja drag and drop',
        //     description: 'Zaimplementować funkcjonalność przeciągania zadań między kolumnami',
        //     status: 'done',
        //     priority: 'high',
        //     assignee: 'user1'
        // },
        // {
        //     id: '2',
        //     type: 'Bug',
        //     title: 'Naprawić błąd z walidacją formularza',
        //     description: 'Formularz nie pokazuje błędów walidacji',
        //     status: 'in-progress',
        //     priority: 'critical',
        //     assignee: 'user2'
        // },
        // {
        //     id: '3',
        //     type: 'Task',
        //     title: 'Dodać nowe ikony',
        //     description: '',
        //     status: 'todo',
        //     priority: 'low',
        //     assignee: null
        // }
    ])

    function addTask(task) {
        const newTask = {
            title: task.title,
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        tasks.value.push(newTask)
        return newTask
    }

    function updateTask(updatedTask) {
        const index = tasks.value.findIndex(t => t.id === updatedTask.id)
        if (index !== -1) {
            tasks.value[index] = {
                ...tasks.value[index],
                ...updatedTask,
                updatedAt: new Date().toISOString()
            }
        }
    }

    function deleteTask(id) {
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    return {
        tasks,
        addTask,
        updateTask,
        deleteTask
    }
})