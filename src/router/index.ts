import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import IndexView from '@/views/user/IndexView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        description: 'Login to your Expiry Date Medicine account',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register',
        description: 'Create a new account to start tracking medicines',
      },
    },
  ],
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

export default router
