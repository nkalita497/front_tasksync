// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || '')

    const isAuthenticated = computed(() => !!token.value)

    async function login(email, password) {
        try {
            const res = await fetch('/api/login', {
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
            user.value = data.user || null
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async function register(firstName, lastName, email, password) {
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password
                })
            })

            if (!res.ok) throw new Error('Rejestracja nie powiodła się')

            const data = await res.json()
            token.value = data.token
            localStorage.setItem('token', data.token)
            user.value = data.user || null
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    function logout() {
        token.value = ''
        user.value = null
        localStorage.removeItem('token')
    }

    return { user, token, isAuthenticated, login, logout, register }
})