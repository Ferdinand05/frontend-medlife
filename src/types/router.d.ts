import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    requiresAuth?: boolean
    guestOnly?: boolean
    roles?: string[]
  }
}
