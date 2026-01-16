import { useAuthStore } from '@/stores/auth'
import { http } from '../http'

export function me() {
  const authStore = useAuthStore()
  return http.get('/user/me', {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}

interface updateUserPayload {
  username: string
  telepon: string
}

export function updateUserInfo(payload: updateUserPayload) {
  const authStore = useAuthStore()

  return http.put(
    '/user/me',
    {
      ...payload,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}

interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export function changePassword(payload: ChangePasswordPayload) {
  const authStore = useAuthStore()

  return http.put(
    '/user/change-password',
    {
      ...payload,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}
