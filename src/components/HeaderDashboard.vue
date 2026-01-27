<script lang="ts" setup>
const props = defineProps<{
  title: string
  modal: HTMLDialogElement | null
}>()
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-semibold">{{ props.title }}</h1>
      <p class="font-light text-lg">Manage {{ props.title }} Data</p>
    </div>
  </div>

  <div class="flex md:justify-between gap-3 items-center w-full flex-col md:flex-row">
    <slot />
    <div>
      <button class="btn btn-success btn-md" @click="props.modal?.showModal()">
        Create new {{ props.title }}
      </button>
    </div>
  </div>
</template>
