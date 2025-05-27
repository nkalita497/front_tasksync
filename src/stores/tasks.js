import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref([])

    async function updateTask(updatedTask) {
        const authStore = useAuthStore()
        const taskToUpdate = { ...updatedTask }
        try {
            const res = await fetch(`http://localhost:8081/tasks/update/${updatedTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(taskToUpdate)
            })

            if(res.ok) {
                const index = tasks.value.findIndex(t => t.id === updatedTask.id)
                if (index !== -1) {
                    tasks.value[index] = {
                        ...tasks.value[index],
                        ...updatedTask,
                        updatedAt: new Date().toISOString()
                    }
                }
            }
        } catch (error) {
            console.error('Błąd aktualizacji zadania:', error)
        }
    }

    async function fetchTasks() {
        const authStore = useAuthStore()
        try {
            const res = await fetch('http://localhost:8081/tasks', {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            })

            if(res.ok){
                const backendTasks = await res.json()
                tasks.value = backendTasks
            }
        } catch (error) {
            console.error('Błąd pobierania zadań:', error)
        }
    }

    async function deleteTask(id) {
        const authStore = useAuthStore()
        try {
            const res = await fetch(`http://localhost:8081/tasks/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            })

            if(res.ok) {
                tasks.value = tasks.value.filter(task => task.id !== id)
            }
        } catch (error) {
            console.error('Błąd usuwania zadania:', error)
        }
    }

    return { tasks, updateTask, fetchTasks, deleteTask }
})