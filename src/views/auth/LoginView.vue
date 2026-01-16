<script setup lang="ts">
import { ref } from 'vue'
import UserLayout from '../layouts/UserLayout.vue'
import { login } from '@/services/api/auth/auth.api'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'
import type { IUser } from '@/types/user.type'
import { Loader } from 'lucide-vue-next'
import router from '@/router'
const email = ref<string>('')
const password = ref<string>('')
const authStore = useAuthStore()
//

const buttonLoading = ref<boolean>(false)
const error = ref<string>('')
const submit = async () => {
  buttonLoading.value = true
  error.value = ''
  try {
    const { data } = await login(email.value, password.value)

    const payload: IUser = jwtDecode(data.token)
    console.log(payload)

    authStore.setAuth(payload, data.token)

    router.push({ name: 'home' })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data)
      error.value = err.response?.data.error
    }
  } finally {
    buttonLoading.value = false
  }
}
</script>

<template>
  <UserLayout>
    <section class="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <!-- Card -->
        <div class="bg-base-100 border border-base-300 rounded-box shadow-sm p-6 md:p-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-base-content">Welcome Back</h1>
            <p class="text-base-content/70 mt-1">Login to manage your medicines safely</p>
          </div>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="submit">
            <div>
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                v-model="email"
                required="true"
                class="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                v-model="password"
                type="password"
                required="true"
                class="input input-bordered w-full"
                placeholder="••••••••"
              />
            </div>

            <!-- Extra actions -->
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-sm" />
                <span class="text-base-content/70">Remember me</span>
              </label>

              <a href="#" class="link link-primary"> Forgot password? </a>
            </div>
            <div v-if="error">
              <div role="alert" class="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Error! {{ error }}</span>
              </div>
            </div>
            <!-- Button -->
            <button
              type="submit"
              :disabled="buttonLoading"
              class="btn bg-black disabled:cursor-not-allowed text-white w-full mt-4"
            >
              <span v-if="!buttonLoading"> Login </span>
              <div v-else class="flex justify-items-center gap-x-2 items-center">
                <Loader :size="14" class="animate-spin transition-all" />
                <span>Loading</span>
              </div>
            </button>
          </form>

          <!-- Footer -->
          <div class="text-center mt-6 text-sm text-base-content/70">
            Don’t have an account?
            <RouterLink to="/register" class="link">Register</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </UserLayout>
</template>
