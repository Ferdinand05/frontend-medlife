<script setup lang="ts">
import { CalendarCheck, Pill, TimerOff } from 'lucide-vue-next'
import DashboardUserLayout from '../layouts/DashboardUserLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import type { IMedicine } from '@/types/medicine'
import { getMedicines } from '@/services/api/user/medicine.api'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkToken()
})

const medicines = ref<IMedicine[]>([])

function getData() {
  getMedicines()
    .then((res) => {
      console.log(res.data)
      medicines.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response)
    })
}
onMounted(() => {
  getData()
})

const reminderedMedicines = computed(() => {
  return medicines.value.filter((val) => val.reminderSent === true).length
})

const expiredCount = computed(() => {
  const today = new Date()

  return medicines.value.filter((m) => {
    if (!m.expireDate) return false

    const expireDate = new Date(m.expireDate)
    return expireDate < today
  }).length
})
</script>

<template>
  <DashboardUserLayout>
    <section class="grid md:grid-rows-1 md:grid-cols-3 gap-5 md:gap-8">
      <div class="bg-blue-300 space-y-3 p-5 rounded-sm">
        <div class="flex justify-between items-center">
          <h1 class="font-semibold text-2xl">Medicines</h1>
          <div>
            <Pill />
          </div>
        </div>
        <h2 class="text-center text-2xl md:text-4xl font-bold">{{ medicines.length }}</h2>
      </div>
      <div class="bg-green-300 space-y-3 p-5 rounded-sm">
        <div class="flex justify-between items-center">
          <h1 class="font-semibold text-2xl">Expired Medicines</h1>
          <div>
            <TimerOff />
          </div>
        </div>
        <h2 class="text-center text-2xl md:text-4xl font-bold">{{ expiredCount }}</h2>
      </div>
      <div class="bg-red-300 space-y-3 p-5 rounded-sm">
        <div class="flex justify-between items-center">
          <h1 class="font-semibold text-2xl">Remindered Medicines</h1>
          <div>
            <CalendarCheck />
          </div>
        </div>
        <h2 class="text-center text-2xl md:text-4xl font-bold">{{ reminderedMedicines }}</h2>
      </div>
    </section>
  </DashboardUserLayout>
</template>
