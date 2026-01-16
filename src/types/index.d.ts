import type { Component } from 'vue'

export interface NavbarItem {
  href: string
  label: string
  icon?: Component
}

export interface errorForm {
  unit?: string | string[]
  quantity?: string | string[]
  expireDate?: string | string[]
  name?: string | string[]
  note?: string | string[]
  category?: string | string[]
}

export interface errorFormSetting {
  username?: string | string[]
  telepon?: string | string[]
  oldPassword?: string | string[]
  newPassword?: string | string[]
}
