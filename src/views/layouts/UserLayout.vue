<script lang="ts" setup>
import FooterComponent from '@/components/FooterComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <header>
    <NavbarComponent />
  </header>

  <main class="">
    <slot />
  </main>

  <footer>
    <FooterComponent />
  </footer>
</template>
