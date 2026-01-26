import DashboardView from '@/views/user/DashboardView.vue'
import MedicinesView from '@/views/user/MedicinesView.vue'
import SettingView from '@/views/user/SettingView.vue'
import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user/dashboard',
    name: 'user.dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard User',
      requireAuth: true,
      roles: ['user', 'admin'],
    },
  },
  {
    path: '/user/medicines',
    name: 'user.medicines',
    component: MedicinesView,
    meta: {
      title: 'User Medicines',
      requireAuth: true,
      roles: ['user', 'admin'],
    },
  },
  {
    path: '/user/settings',
    component: SettingView,
    name: 'user.settings',
    meta: {
      title: 'User Settings',
      requireAuth: true,
      roles: ['user', 'admin'],
    },
  },
]

export default userRoutes
