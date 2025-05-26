import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useTasksStore = defineStore('tasks', () => {
    const bearer = 'Bearer ' + localStorage.getItem("token");
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

    // function addTask(task) {
    //     const newTask = {
    //         title: task.title,
    //         ...task,
    //         id: Date.now().toString(),
    //         createdAt: new Date().toISOString(),
    //         updatedAt: new Date().toISOString()
    //     }
    //     tasks.value.push(newTask)
    //     return newTask
    // }

    async function fetchTasks(currentTeam) {
        try {

            console.log(currentTeam)
            const res = await fetch(`http://localhost:8081/tasks/search-by-team/${currentTeam}`, {
                method: 'GET',
                headers: {
                    'Authorization': bearer
                }
            })

            if(res.ok){
                tasks.value = await res.json()
            }else if (res.status === 404){
                console.log("Nie znaleziono żadnych zadań")
            }
        } catch (error) {
            console.error('Błąd pobierania tasków:', error)
        }
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

    async function deleteTask(id) {
        try {
            const res = await fetch(`http://localhost:8081/tasks/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': bearer
                }
            })

            if(res.ok){
                return true
            }else if (res.status === 404){
                return false
            }
        } catch (error) {
            console.error('Błąd pobierania tasków:', error)
            return false
        }
    }

    return {
        tasks,
        // addTask,
        fetchTasks,
        updateTask,
        deleteTask
    }
})