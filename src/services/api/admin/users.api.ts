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

interface payloadUser {
  _id?: string
  username: string
  email: string
  role: string
  telepon: string
  password?: string
}

export function updateUser(data: payloadUser) {
  const authStore = useAuthStore()

  return http.put(
    `/admin/users/${data._id}`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}

export function deleteUser(userId: string) {
  const authStore = useAuthStore()

  return http.delete(`/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}

export function createUser(data: payloadUser) {
  const authStore = useAuthStore()

  return http.post(
    '/admin/users',
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}
