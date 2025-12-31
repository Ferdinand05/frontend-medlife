<script setup lang="ts">
import UserLayout from '../layouts/UserLayout.vue'
import { RouterLink } from 'vue-router'
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
          <form class="space-y-4">
            <!-- Username -->
            <div>
              <label class="label">
                <span class="label-text">Username</span>
              </label>
              <input type="text" class="input input-bordered w-full" placeholder="yourusername" />
            </div>

            <!-- Email -->
            <div>
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
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
                class="input input-bordered w-full"
                placeholder="+62 812 3456 7890"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input type="password" class="input input-bordered w-full" placeholder="••••••••" />
              <label class="label">
                <span class="label-text-alt text-base-content/60 text-xs">
                  Minimum 8 characters
                </span>
              </label>
            </div>

            <!-- Button -->
            <button class="btn bg-black text-white w-full mt-4">Create Account</button>
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
