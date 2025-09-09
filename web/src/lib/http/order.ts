import { apiFetch } from './wrapper'
import type { Order, OrderPayload } from '@/types/order'

export const order = {
  async createOrder(payload: OrderPayload) {
    await apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  async listOrders() {
    const data = await apiFetch('/api/orders', {
      method: 'GET',
    })
    return data as Array<Order>
  },
  async listCompletedOrders() {
    const data = await apiFetch('/api/orders/completed', {
      method: 'GET',
    })
    return data as Array<Order>
  },
  async getOrder(id: number) {
    const data = await apiFetch(`/api/orders/${id}`, {
      method: 'GET',
    })
    return data as Order
  },
  async updateOrder(id: number, payload: OrderPayload) {
    await apiFetch(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  async deleteOrder(id: number) {
    await apiFetch(`/api/orders/${id}`, {
      method: 'DELETE',
    })
  },
}
