<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  for?: string
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

function showModal() {
  dialogRef.value?.showModal()
}

function close() {
  dialogRef.value?.close()
}

defineExpose({
  showModal,
  close,
})
</script>

<template>
  <dialog ref="dialogRef" class="modal z-10">
    <div class="modal-box z-10">
      <h3 class="text-lg font-bold">{{ props.for }} {{ props.title }}</h3>

      <slot />

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
