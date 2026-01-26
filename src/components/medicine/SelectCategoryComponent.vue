<script lang="ts" setup>
import { getCategories } from '@/services/api/user/category.api'
import type { ICategory } from '@/types/medicine'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | null): void
}>()

const categories = ref<ICategory[]>([])
onMounted(() => {
  getCategories()
    .then((res) => {
      categories.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response)
    })
})

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value || null)

  console.log(value)
}
</script>

<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">Category</legend>
    <select
      class="select w-full"
      @change="onChange"
      :value="props.modelValue"
      placeholder="Category"
    >
      <option v-for="(c, i) in categories" :key="i" :value="c._id">{{ c.name }}</option>
    </select>
  </fieldset>
</template>
