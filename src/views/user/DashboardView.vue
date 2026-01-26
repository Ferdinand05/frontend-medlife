<script setup lang="ts">
import { CalendarCheck, Pill, TimerOff } from 'lucide-vue-next'
import DashboardUserLayout from '../layouts/DashboardUserLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import type { IMedicine } from '@/types/medicine'
import { getMedicines } from '@/services/api/user/medicine.api'
import DashboardStats, { type IStatDashboard } from '@/components/DashboardStats.vue'

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

const stats = computed<IStatDashboard[]>(() => [
  {
    name: 'Medicines',
    count: medicines.value.length,
    icon: Pill,
    color: 'blue',
  },
  {
    name: 'Remindered Medicines',
    count: reminderedMedicines.value,
    icon: CalendarCheck,
    color: 'green',
  },
  {
    name: 'Expired Medicines',
    count: expiredCount.value,
    icon: TimerOff,
    color: 'red',
  },
])
</script>

<template>
  <DashboardUserLayout>
    <DashboardStats :stats="stats" />
  </DashboardUserLayout>
</template>
