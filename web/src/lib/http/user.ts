import { apiFetch } from './wrapper'
import type { User } from '@/types/user'

export const user = {
  async createUser(data: FormData) {
    await apiFetch(`/api/auth/register`, {
      method: 'POST',
      body: data,
    })
  },
  async getUsers() {
    const data = await apiFetch(`/api/users`)
    return data as Array<User>
  },
  async getUser(id: number) {
    const data = await apiFetch(`/api/users/${id}`)
    return data as User
  },
  async updateUserInfo(id: number, payload: FormData) {
    await apiFetch(`/api/users/${id}/info`, {
      method: 'PUT',
      body: payload,
    })
  },
  async getUsersByRole(
    role_slug: string,
    page: number = 1,
    rows: number = 10,
    query: string = '',
  ) {
    const data = await apiFetch(
      `/api/users/role?role_slug=${role_slug}&page=${page}&rows=${rows}&query=${query}`,
    )
    return data as { users: Array<User>; count: number }
  },
  async toggleUserStatus(id: number) {
    await apiFetch(`/api/users/${id}/status`, {
      method: 'PUT',
    })
  },
}
