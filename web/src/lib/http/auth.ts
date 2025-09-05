import { apiFetch } from './wrapper'
import type { User } from '@/types/user'

export const auth = {
  async getMe() {
    try {
      const data = await apiFetch('/api/auth/me')
      return data as User
    } catch (e) {
      return null
    }
  },
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      if (res.status == 500) throw new Error(res.statusText)
      if (res.status == 404) throw new Error('Route Not Found!')
      const errorResponse = await res.json()
      throw new Error(errorResponse.error || 'Unknown error')
    }
    const json = await res.json()
    return json as User
  },
  async logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    })
    if (!res.ok) {
      const errorResponse = await res.json()
      throw new Error(errorResponse.error || 'Unknown error')
    }
  },
}
