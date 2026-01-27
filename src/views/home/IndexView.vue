<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import UserLayout from '../layouts/UserLayout.vue'
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'

onBeforeMount(() => {
  const authStore = useAuthStore()

  authStore.checkToken()
})
</script>

<template>
  <UserLayout>
    <!-- Home -->
    <section class="h-screen" style="background-image: url('/img/bg2.png')">
      <div
        class="mx-auto px-6 py-10 font-inter flex justify-center items-center flex-col h-full max-w-4xl"
      >
        <h1 class="text-3xl md:text-6xl font-bold text-center">
          <span class="text-red-500"><s>Never</s></span> miss a
          <span class="text-green-400">medicine</span> expiry.
        </h1>
        <div class="mt-4 md:mt-6 md:text-2xl text-lg text-gray-600 w-full text-center">
          Track, monitor, and get reminders before your medicines expire.
        </div>
        <div class="text-center mt-6 md:mt-10">
          <button class="btn md:text-lg btn-primary">
            <RouterLink to="/register"> Get Started </RouterLink>
          </button>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="py-16 md:py-24 bg-gray-50">
      <div class="container mx-auto px-6 max-w-6xl">
        <div class="text-center mb-14">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">About Medlife</h2>
          <p class="text-base-content/70 max-w-3xl mx-auto md:text-lg">
            <span class="text-blue-500 font-semibold">Medlife</span> helps you stay safe by tracking
            medicine expiration dates and sending timely reminders — simple, reliable, and
            stress-free.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left: Description -->
          <div class="space-y-6">
            <div class="flex gap-4">
              <span class="text-2xl">⏰</span>
              <div>
                <h3 class="font-semibold text-lg">Smart Reminders</h3>
                <p class="text-base-content/70">
                  Get notified before your medicine expires so you never miss it.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <span class="text-2xl">📊</span>
              <div>
                <h3 class="font-semibold text-lg">Clear Dashboard</h3>
                <p class="text-base-content/70">
                  All medicines and expiry statuses neatly organized in one place.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <span class="text-2xl">🔔</span>
              <div>
                <h3 class="font-semibold text-lg">Stay Safe</h3>
                <p class="text-base-content/70">
                  Reduce health risks by avoiding expired medication.
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Visual highlight -->
          <div class="bg-white rounded-2xl p-8 shadow-sm border">
            <h4 class="font-semibold text-lg mb-4">Why Medlife?</h4>
            <ul class="space-y-3 text-base-content/70">
              <li>✔ Simple & easy to use</li>
              <li>✔ Automatic expiry reminders</li>
              <li>✔ Designed for daily health safety</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 md:py-24 bg-white" id="how">
      <div class="container mx-auto px-6 max-w-6xl">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-16">How It Works</h2>

        <div class="relative grid md:grid-cols-3 gap-12">
          <!-- Line (desktop) -->
          <div class="hidden md:block absolute top-8 left-0 right-0 h-px bg-base-300"></div>

          <!-- Step 1 -->
          <div class="text-center relative">
            <div
              class="w-16 h-16 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl mb-6"
            >
              💊
            </div>
            <h3 class="font-semibold text-lg mb-2">Add Medicine</h3>
            <p class="text-base-content/70">Enter medicine name, quantity, and expiration date.</p>
          </div>

          <!-- Step 2 -->
          <div class="text-center relative">
            <div
              class="w-16 h-16 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl mb-6"
            >
              📅
            </div>
            <h3 class="font-semibold text-lg mb-2">Track Expiry</h3>
            <p class="text-base-content/70">Monitor all medicines clearly from your dashboard.</p>
          </div>

          <!-- Step 3 -->
          <div class="text-center relative">
            <div
              class="w-16 h-16 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl mb-6"
            >
              🔔
            </div>
            <h3 class="font-semibold text-lg mb-2">Get Reminded</h3>
            <p class="text-base-content/70">Receive alerts before medicines expire.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24">
      <div class="max-w-3xl mx-auto text-center px-4">
        <h2 class="text-2xl md:text-4xl font-bold mb-4">
          Start Tracking Your <span class="text-green-400">Medicines</span> Today
        </h2>
        <p class="text-base-content/70 md:text-lg mb-8">
          Avoid expired medicines, stay safe, and manage everything in one place.
        </p>

        <div class="flex justify-center gap-4">
          <a href="/register" class="btn btn-primary rounded-md"> Get Started </a>
          <a href="/login" class="btn btn-outline rounded-md"> Login </a>
        </div>
      </div>
    </section>
  </UserLayout>
</template>
