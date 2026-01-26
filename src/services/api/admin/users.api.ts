import { useAuthStore } from '@/stores/auth'
import { http } from '../http'

export function getAllUsers() {
  const authStore = useAuthStore()

  return http.get('/admin/users', {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}
