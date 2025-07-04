import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useTasksStore} from "@/stores/tasks.js";
import {useTeamStore} from "@/stores/team.js";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || '')
    const isAuthenticated = computed(() => !!token.value)
    const taskStore = useTasksStore();

    async function login(email, password) {
        try {
            const res = await fetch('http://localhost:8081/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) throw new Error('Logowanie nie powiodło się')

            const data = await res.json()
            token.value = data.token
            localStorage.setItem('token', data.token)
            await me();

            const teamStore = useTeamStore()
            await teamStore.fetchTeams()
            await taskStore.fetchTasks(teamStore.currentTeamId)


        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async function register(firstName, lastName, email, password) {
        try {
            const res = await fetch('http://localhost:8081/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password })
            })

            if (!res.ok) throw new Error('Rejestracja nie powiodła się')

        } catch (err) {
            console.error(err)
            throw err
        }
    }

    function logout() {
        token.value = ''
        user.value = null
        taskStore.clearTasks && taskStore.clearTasks()
        const teamStore = useTeamStore()
        teamStore.clearTeams && teamStore.clearTeams()
        localStorage.removeItem('token')
    }



    async function me() {
        if (!token.value) return

        try {
            const res = await fetch('http://localhost:8081/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            if (!res.ok) throw new Error('Token nieważny')

            const data = await res.json()
            user.value = data
            // console.log("TUTAJ")
            // console.log(user.value);
            return user.value;
        } catch (err) {
            logout()
        }
    }



    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        register,
        me,
    }
})
