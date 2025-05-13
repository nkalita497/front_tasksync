import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useTasks() {
    const tasks = ref([])
    const loading = ref(false)
    const error = ref(null)
    const authStore = useAuthStore()

    const fetchTasks = async () => {
        try {
            loading.value = true
            error.value = null
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch tasks')

            tasks.value = await response.json()
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const createTask = async (taskData) => {
        try {
            const response = await fetch('/api/tasks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(taskData)
            })

            if (!response.ok) throw new Error('Failed to create task')

            return await response.json()
        } catch (err) {
            throw err
        }
    }

    const updateTask = async (taskId, taskData) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(taskData)
            })

            if (!response.ok) throw new Error('Failed to update task')

            return await response.json()
        } catch (err) {
            throw err
        }
    }

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            })

            if (!response.ok) throw new Error('Failed to delete task')
        } catch (err) {
            throw err
        }
    }

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask
    }
}