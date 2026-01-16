import router from '@/router'
import { me } from '@/services/api/user/user.api'
import type { IUser } from '@/types/user.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const user = ref<IUser | null>(null)
    const isAuthenticated = ref<boolean>(false)

    function setAuth(newUser: IUser, newToken: string) {
      token.value = newToken
      user.value = newUser
      isAuthenticated.value = true
    }

    function logout() {
      token.value = null
      user.value = null
      isAuthenticated.value = false

      router.push({ name: 'home' })
    }

    function checkToken() {
      me().catch((err) => {
        console.log(err.response)
        if (err.response.data.error == 'Token Expired') {
          logout()
        }
      })
    }

    return { token, user, isAuthenticated, setAuth, logout, checkToken }
  },
  {
    persist: true,
  },
)
