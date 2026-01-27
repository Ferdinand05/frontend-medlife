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

interface CategoryPayload {
  _id?: string
  name?: string
}

export function updateCategory(payload: CategoryPayload) {
  const authStore = useAuthStore()

  return http.put(
    `/admin/categories/${payload._id}`,
    { name: payload.name },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}

export function createCategory(payload: CategoryPayload) {
  const authStore = useAuthStore()
  return http.post(
    '/admin/categories',
    { name: payload.name },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}

export function deleteCategory(categoryId: string) {
  const authStore = useAuthStore()

  return http.delete(`/admin/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}
