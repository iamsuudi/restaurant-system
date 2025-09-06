import { apiFetch } from './wrapper'
import type { Menu } from '@/types/menu'

export const menu = {
  async createMenu(payload: FormData) {
    await apiFetch('/api/menu', {
      method: 'POST',
      body: payload,
    })
  },
  async listAllMenu() {
    const data = await apiFetch('/api/menu', {
      method: 'GET',
    })
    return data as Array<Menu>
  },
  async getMenu(id: number) {
    const data = await apiFetch(`/api/menu/${id}`, {
      method: 'GET',
    })
    return data as Menu
  },
  async updateMenu(id: number, payload: FormData) {
    await apiFetch(`/api/menu/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  async deleteMenu(id: number) {
    await apiFetch(`/api/menu/${id}`, {
      method: 'DELETE',
    })
  },
}
