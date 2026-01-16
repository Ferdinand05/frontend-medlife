<script setup lang="ts">
import { register, type RegisterPayload } from '@/services/api/auth/auth.api'
import UserLayout from '../layouts/UserLayout.vue'
import { RouterLink } from 'vue-router'
import { reactive, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Loader } from 'lucide-vue-next'
const form = reactive<RegisterPayload>({
  email: '',
  username: '',
  password: '',
  telepon: '',
})
const buttonLoading = ref<boolean>(false)
const error = ref<string>('')
const registerUser = async () => {
  buttonLoading.value = true
  error.value = ''
  try {
    const { data } = await register(form)

    if (data.success) {
      Swal.fire({
        title: 'Good job!',
        text: `${data.success}`,
        icon: 'success',
      })

      form.username = ''
      form.email = ''
      form.telepon = ''
      form.password = ''
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data)
      error.value = err.response?.data.errors
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
            <h1 class="text-2xl font-bold text-base-content">Create an Account</h1>
            <p class="text-base-content/70 mt-1">Start tracking your medicines safely</p>
          </div>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="registerUser">
            <!-- Username -->
            <div>
              <label class="label">
                <span class="label-text">Username</span>
              </label>
              <input
                type="text"
                v-model="form.username"
                class="input input-bordered w-full"
                placeholder="yourusername"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                v-model="form.email"
                class="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="label">
                <span class="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                v-model="form.telepon"
                class="input input-bordered w-full"
                placeholder="+62 812 3456 7890"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                type="password"
                v-model="form.password"
                class="input input-bordered w-full"
                placeholder="••••••••"
              />
              <label class="label">
                <span class="label-text-alt text-base-content/60 text-xs">
                  Minimum 7 characters
                </span>
              </label>
            </div>

            <!-- showing error -->
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
                <ul class="list-disc text-sm">
                  <li class="text-sm" v-for="(err, i) in error" :key="i">
                    {{ err[0] }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Button -->
            <button
              :disabled="buttonLoading"
              type="submit"
              class="disabled:cursor-not-allowed btn bg-black text-white w-full mt-4"
            >
              <span v-if="!buttonLoading"> Create Account </span>
              <div v-else class="flex justify-items-center gap-x-2 items-center">
                <Loader :size="14" class="animate-spin transition-all" />
                <span>Loading</span>
              </div>
            </button>
          </form>

          <!-- Footer -->
          <div class="text-center mt-6 text-sm text-base-content/70">
            Already have an account?
            <RouterLink to="/login" class="link">Login</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </UserLayout>
</template>
