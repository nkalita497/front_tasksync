import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "./stores/auth"

const routes = [
    {
        path: "/",
        name: "welcome",
        component: () => import("./views/WelcomeView.vue"),
        meta: { requiresGuest: true },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("./views/LoginView.vue"),
        meta: { requiresGuest: true },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("./views/RegisterView.vue"),
        meta: { requiresGuest: true },
    },
    {
        path: "/tasks",
        name: "tasks",
        component: () => import("./views/TasksView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/teams",
        name: "teams",
        component: () => import("./views/TeamManagementView.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/groups",
        name: "groups",
        component: () => import("./views/GroupList.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("./views/ProfileView.vue"),
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    await authStore.me()

    const isAuthenticated = authStore.isAuthenticated

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next("/")
    }

    if (to.meta.requiresGuest && isAuthenticated) {
        return next("/tasks")
    }

    next()
})

export default router
