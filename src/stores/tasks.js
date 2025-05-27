import { ref } from 'vue'
import { defineStore } from 'pinia'

const bearer = 'Bearer eyJhbGciOiJIUzI5NiIsInR5cCI6IkJWTiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzE0NjQ0Mzg0LCJleHAiOjE3MTQ3MzA3ODR9.XFwWw03e4h01K3sTfN_W-4qEa-6QjGzW1o1-v9jB-4I'

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref([])

    async function updateTask(updatedTask) {
        const taskToUpdate = { ...updatedTask }
        try {
            const res = await fetch(`http://localhost:8081/tasks/update/${updatedTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearer
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
        try {
            const res = await fetch('http://localhost:8081/tasks', {
                headers: {
                    'Authorization': bearer
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
        try {
            const res = await fetch(`http://localhost:8081/tasks/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': bearer
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