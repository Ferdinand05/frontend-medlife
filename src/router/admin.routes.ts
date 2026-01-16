import CategoryView from '@/views/admin/CategoryView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import MedicinesView from '@/views/admin/MedicinesView.vue'
import SettingsView from '@/views/admin/SettingsView.vue'
import UsersView from '@/views/admin/UsersView.vue'
import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/dashboard',
    component: DashboardView,
    name: 'admin.dashboard',
    meta: {
      title: 'Admin Dashboard',
      requireAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/admin/users',
    component: UsersView,
    name: 'admin.users',
    meta: {
      title: 'List Users',
      requireAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/admin/categories',
    component: CategoryView,
    name: 'admin.category',
    meta: {
      title: 'List Category',
      requireAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/admin/medicines',
    component: MedicinesView,
    name: 'admin.medicines',
    meta: {
      title: 'List Medicines',
      requireAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/admin/settings',
    component: SettingsView,
    name: 'admin.settings',
    meta: {
      title: 'Admin Setting',
      requireAuth: true,
      role: 'admin',
    },
  },
]

export default adminRoutes
