import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

// Import komponentów widoków
import LoginView from './views/AuthView.vue'
import RegisterView from './views/AuthView.vue'
import DashboardView from './views/DashboardView.vue'

const routes = [
    { path: '/', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/dashboard', component: DashboardView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    const publicPages = ['/', '/register']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired && !auth.isAuthenticated) {
        return next('/')
    }

    next()
})

export default router
