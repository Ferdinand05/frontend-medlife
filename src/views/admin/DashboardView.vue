<script setup lang="ts">
import DashboardStats, { type IStatDashboard } from '@/components/DashboardStats.vue'
import DashboardAdminLayout from '../layouts/DashboardAdminLayout.vue'
import { computed, onMounted, ref } from 'vue'
import { getAllMedicines } from '@/services/api/admin/medicine.api'
import type { IMedicine } from '@/types/medicine'
import { CalendarCheck, Pill, TimerOff, Users } from 'lucide-vue-next'
import { getAllUsers } from '@/services/api/admin/users.api'
import type { IUser } from '@/types/user.type'
import { useAuthStore } from '@/stores/auth'

const medicines = ref<IMedicine[]>([])
const authStore = useAuthStore()
function getData() {
  getAllMedicines()
    .then((res) => {
      console.log(res.data)
      medicines.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response)
    })
}

const users = ref<IUser[]>([])
function getDataUsers() {
  getAllUsers()
    .then((res) => {
      users.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response.data)
    })
}
onMounted(() => {
  getData()
  getDataUsers()
  authStore.checkToken()
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
    name: 'Users',
    count: users.value.length,
    icon: Users,
    color: 'gray',
  },
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
  <DashboardAdminLayout>
    <DashboardStats :stats="stats" />
  </DashboardAdminLayout>
</template>
