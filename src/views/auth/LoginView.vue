<script setup lang="ts">
import UserLayout from '../layouts/UserLayout.vue'
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
          <form class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
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

            <!-- Button -->
            <button class="btn bg-black text-white w-full mt-4">Login</button>
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
