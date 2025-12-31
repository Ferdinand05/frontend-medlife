<script lang="ts" setup>
import FooterComponent from '@/components/FooterComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <header>
    <NavbarComponent />
  </header>

  <main class="px-4 mx-auto md:px-6 lg:px-8">
    <slot />
  </main>

  <footer>
    <FooterComponent />
  </footer>
</template>
