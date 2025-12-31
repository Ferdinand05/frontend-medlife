import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  'auht',
  () => {
    const token = ref<string>()
    const user = ref<{
      id: string
      username: string
      email: string
      role: string
    }>()

    return { token, user }
  },
  {
    persist: true,
  },
)
