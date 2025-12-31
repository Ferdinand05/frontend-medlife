<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import UserLayout from '../layouts/UserLayout.vue'
</script>

<template>
  <UserLayout>
    <!-- Home -->
    <section class="py-16 md:py-28">
      <div class="mx-auto px-6 py-10 font-inter">
        <h1 class="text-3xl md:text-6xl font-bold text-center">
          <span class="text-red-500"><s>Never</s></span> miss a
          <span class="text-green-400">medicine</span> expiry.
        </h1>
        <div class="mt-4 md:mt-6 md:text-2xl text-lg w-full text-center">
          Track, monitor, and get reminders before your medicines expire.
        </div>
        <div class="text-center mt-6 md:mt-10">
          <button class="btn rounded-md md:text-lg hover:bg-gray-200">
            <RouterLink to="/register"> Get Started </RouterLink>
          </button>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-6 max-w-6xl">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-4">About</h2>

        <p class="text-center text-base-content/70 max-w-3xl md:text-lg mx-auto mb-12">
          <span class="text-blue-500 font-semibold"> Medlife </span> helps you track medicine
          expiration dates and receive reminders before they expire, keeping your medication safe
          and well managed.
        </p>

        <div class="grid gap-8 md:grid-cols-3">
          <div class="card bg-base-200 shadow-sm">
            <div class="card-body items-center text-center">
              <span class="text-3xl">⏰</span>
              <h3 class="font-semibold text-lg">Smart Reminders</h3>
              <p class="text-base-content/70">
                Get notified before your medicine reaches its expiration date.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-sm">
            <div class="card-body items-center text-center">
              <span class="text-3xl">📊</span>
              <h3 class="font-semibold text-lg">Clear Dashboard</h3>
              <p class="text-base-content/70">
                View all your medicines and their expiry status in one place.
              </p>
            </div>
          </div>

          <div class="card bg-base-200 shadow-sm">
            <div class="card-body items-center text-center">
              <span class="text-3xl">🔔</span>
              <h3 class="font-semibold text-lg">Stay Safe</h3>
              <p class="text-base-content/70">
                Avoid using expired medicines and reduce health risks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-14 md:py-20">
      <h2 class="text-2xl md:text-3xl font-bold mb-10 text-center">How It Works</h2>

      <div class="grid gap-8 md:grid-cols-3">
        <!-- Step 1 -->
        <div class="text-center p-6 rounded-box bg-base-200">
          <div class="text-4xl mb-4">💊</div>
          <h3 class="text-lg font-semibold mb-2">Add Your Medicine</h3>
          <p class="text-base-content/70">Input medicine name, quantity, and expiry date easily.</p>
        </div>

        <!-- Step 2 -->
        <div class="text-center p-6 rounded-box bg-base-200">
          <div class="text-4xl mb-4">📅</div>
          <h3 class="text-lg font-semibold mb-2">Track Expiry Dates</h3>
          <p class="text-base-content/70">View all expiration dates clearly in one dashboard.</p>
        </div>

        <!-- Step 3 -->
        <div class="text-center p-6 rounded-box bg-base-200">
          <div class="text-4xl mb-4">🔔</div>
          <h3 class="text-lg font-semibold mb-2">Get Reminded</h3>
          <p class="text-base-content/70">Receive reminders before your medicines expire.</p>
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
