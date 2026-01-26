import { useAuthStore } from '@/stores/auth'
import { http } from '../http'

export function getAllMedicines() {
  const authStore = useAuthStore()

  return http.get('/admin/medicines', {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}

export interface medicinePayload {
  _id?: string
  name: string
  quantity: number | null
  unit: 'strip' | 'tablet' | 'ml' | 'bottle' | string
  expireDate: string
  category: string | null
  user: string | null
  note: string | null
}
export function storeMedicine(payload: medicinePayload) {
  const authStore = useAuthStore()

  return http.post(
    '/admin/medicines',
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

export function updateMedicine(payload: medicinePayload) {
  const authStore = useAuthStore()

  return http.put(
    `/admin/medicines/${payload._id}`,
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

export function deleteMedicine(id: string) {
  const authStore = useAuthStore()

  return http.delete(`/admin/medicines/${id}`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}
