import { createRouter, createWebHistory } from 'vue-router'
import AuthView from './views/AuthView.vue'
import DashboardView from './views/DashboardView.vue'
import TasksView from './views/TasksView.vue'
import UsersView from './views/UsersView.vue'

const routes = [
    { path: '/', component: AuthView },
    { path: '/dashboard', component: DashboardView },
    { path: '/tasks', component: TasksView },
    { path: '/users', component: UsersView }
]

export default createRouter({
    history: createWebHistory(),
    routes
})