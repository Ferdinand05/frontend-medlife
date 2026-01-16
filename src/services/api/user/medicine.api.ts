import { useAuthStore } from '@/stores/auth'
import { http } from '../http'
import type { IMedicine } from '@/types/medicine'

export const getMedicines = () => {
  const authStore = useAuthStore()

  return http.get('/user/medicines', {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}

export const deleteMedicine = (id: string) => {
  const authStore = useAuthStore()

  return http.delete(`/user/medicines/${id}`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  })
}

export interface UpdateMedicinePayload {
  _id: string
  name: string
  quantity: number
  unit: string
  expireDate: Date | null
  category: string | null
  note?: string
}

export const updateMedicine = (medicine: UpdateMedicinePayload) => {
  const authStore = useAuthStore()

  return http.put(
    `/user/medicines/${medicine._id}`,
    {
      ...medicine,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}

interface CreateMedicinePayload {
  name: string
  quantity: number | null
  unit: string
  expireDate: string
  note?: string
  category: string
}

export const createMedicine = (medicine: CreateMedicinePayload) => {
  const authStore = useAuthStore()
  return http.post(
    '/user/medicines',
    {
      ...medicine,
    },
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  )
}
