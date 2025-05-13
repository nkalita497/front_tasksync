import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)

    const isAuthenticated = computed(() => !!user.value)

    function login(email, password) {
//logika logowania TODO
        user.value = { name: 'Test User', email }
    }

    function register(name, email, password) {
        // logika rejestracji TODO
        user.value = { name, email }
    }

    return { user, isAuthenticated, login, register }
})