import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Profile from '../pages/Profile.vue'
import Cart from '../pages/Cart.vue'
import Riwayat from '../pages/Riwayat.vue'

const routes = [
  {
    path: '/',
    name: 'Marketplace',
    component: Dashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/riwayat',
    name: 'Riwayat',
    component: Riwayat,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.guest && (auth.isAuthenticated || localStorage.getItem('userName'))) {
    next({ name: 'Marketplace' })
  } else if (to.meta.requiresAuth && !auth.isAuthenticated && !localStorage.getItem('userName')) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
