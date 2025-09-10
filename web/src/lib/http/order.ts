import { apiFetch } from './wrapper'
import type { Order, OrderItem, OrderPayload } from '@/types/order'

export const order = {
  async createOrder(payload: OrderPayload) {
    await apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  async listOrders(page: number, limit: number) {
    const data = await apiFetch(`/api/orders?page=${page}&rows=${limit}`, {
      method: 'GET',
    })
    return data as { orders: Array<Order>; count: number }
  },
  async listCompletedOrders(page: number, limit: number) {
    const data = await apiFetch(
      `/api/orders?status=completed&page=${page}&rows=${limit}`,
      {
        method: 'GET',
      },
    )
    return data as { orders: Array<Order>; count: number }
  },
  async getOrder(id: number) {
    const data = await apiFetch(`/api/orders/${id}`, {
      method: 'GET',
    })
    return data as Order
  },
  async getOrderItems(id: number) {
    const data = await apiFetch(`/api/orders/${id}/items`, {
      method: 'GET',
    })
    return data as Array<OrderItem>
  },
  async updateOrder(id: number, payload: OrderPayload) {
    await apiFetch(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  async updateOrderStatus(id: number, status: string) {
    await apiFetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },
  async deleteOrder(id: number) {
    await apiFetch(`/api/orders/${id}`, {
      method: 'DELETE',
    })
  },
}
