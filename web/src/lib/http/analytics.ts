import { apiFetch } from './wrapper'

export const analytics = {
  async getAvgPrepTime(target: string) {
    const data = await apiFetch(`/api/analytics/avg-prep-time/${target}`)
    return data as number
  },
  async countCompletedOrders(target: string) {
    const data = await apiFetch(
      `/api/analytics/count-completed-orders/${target}`,
    )
    return data as number
  },
  async countActiveOrders() {
    const data = await apiFetch(`/api/analytics/count-active-orders`)
    return data as number
  },
}
