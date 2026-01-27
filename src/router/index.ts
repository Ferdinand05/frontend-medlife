import IndexView from '@/views/home/IndexView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import adminRoutes from './admin.routes'
import { useAuthStore } from '@/stores/auth'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
      meta: {
        title: 'Home',

        description: 'Manage and track your medicine expiration dates',
      },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
      meta: {
        title: 'Forbidden',
        description: 'Access Denied',
      },
    },
    ...authRoutes,
    ...userRoutes,
    ...adminRoutes,
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

router.afterEach((to) => {
  const appName = 'Medlife'

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} | ${appName}` : appName

  // Set meta description
  const description = to.meta.description || 'Track medicine expiry dates safely'

  let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null

  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }

  metaDescription.content = description as string
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  /**
   * 🔐 Route butuh login
   */
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  /**
   * 🛡️ Route punya role tertentu
   */
  const userRole = authStore.user?.role as string
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return { name: 'forbidden' }
  }

  /**
   * 🚫 Sudah login tapi akses halaman auth (login/register)
   */
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (authStore.user?.role === 'admin') {
      return { name: 'admin.dashboard' }
    }

    return { name: 'user.dashboard' }
  }
})

export default router
