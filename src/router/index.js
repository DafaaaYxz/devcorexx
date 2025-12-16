import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TerminalView from '../views/TerminalView.vue'
import AdminView from '../views/AdminView.vue'
import QuotesView from '../views/QuotesView.vue'
import AboutView from '../views/AboutView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import ProfileView from '../views/ProfileView.vue'
import DocsView from '../views/DocsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/about', component: AboutView },
    { path: '/quotes', component: QuotesView },
    { path: '/maintenance', component: MaintenanceView },
    
    // Protected Routes
    { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/docs', component: DocsView, meta: { requiresAuth: true } },
    { path: '/terminal', component: TerminalView, meta: { requiresAuth: true } },
    { path: '/history', component: TerminalView, meta: { requiresAuth: true } },
    { path: '/admin', component: AdminView, meta: { requiresAuth: true, adminOnly: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) next('/login');
  else if (to.meta.adminOnly && !auth.isAdmin) next('/');
  else next();
})
export default router
