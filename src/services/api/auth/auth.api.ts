import { http } from '../http'

export const login = (email: string, password: string) => {
  return http.post('/login', {
    email,
    password,
  })
}

export interface RegisterPayload {
  username: string
  email: string
  telepon: string
  password: string
}

export const register = (payload: RegisterPayload) => {
  return http.post('/register', payload)
}
