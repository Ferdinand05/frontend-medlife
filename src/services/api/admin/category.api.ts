import { useAuthStore } from '@/stores/auth'
import { http } from '../http'

export const getCategories = () => {
  const authStore = useAuthStore()

  return http.get('/admin/categories', {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}
