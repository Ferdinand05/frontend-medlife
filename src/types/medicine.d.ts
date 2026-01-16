import type { IUser } from './user.type'

export interface ICategory {
  _id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface IMedicine {
  _id: string
  name: string
  quantity: number
  unit: string
  expireDate: string
  reminderSent?: boolean
  note?: string
  user?: IUser | string
  category: string | ICategory
  createdAt?: string
  updatedAt?: string
}
