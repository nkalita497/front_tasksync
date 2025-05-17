import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes = [
    {
        path: '/',
        name: 'welcome',
        component: () => import('./views/WelcomeView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./views/LoginView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./views/RegisterView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('./views/TasksView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('./views/UsersView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/groups',
        name: 'groups',
        component: () => import('./views/GroupList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('./components/users/UserProfile.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()


    const isAuthenticated = authStore.isAuthenticated

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login')
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return next('/tasks')
    }

    next()
})

export default router