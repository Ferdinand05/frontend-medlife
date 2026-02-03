<script lang="ts" setup>
import { markRaw, type Component } from 'vue'

export interface IStatDashboard {
  name: string
  count: number | null
  icon: Component
  color?: string
}

const props = defineProps<{
  stats: IStatDashboard[]
}>()

props.stats.forEach(stat => {
  stat.icon = markRaw(stat.icon)
})

</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 w-full justify-around">
    <div
      :class="[
        'space-y-3 p-5 rounded-sm w-full border border-gray-300 shadow',
        stat.color === 'blue' && 'bg-blue-300',
        stat.color === 'green' && 'bg-green-300',
        stat.color === 'red' && 'bg-red-300',
        stat.color === 'gray' && 'bg-gray-300',
      ]"
      v-for="(stat, i) in props.stats"
      :key="i"
    >
      <div class="flex justify-between items-center">
        <h1 class="font-semibold text-2xl">{{ stat.name }}</h1>
        <div>
          <component :is="stat.icon" />
        </div>
      </div>
      <h2 class="text-center text-2xl md:text-4xl font-bold">{{ stat.count ?? '-' }}</h2>
    </div>
  </section>
</template>
