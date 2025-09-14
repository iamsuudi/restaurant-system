import { apiFetch } from './wrapper'
import type {
  OrdersAndRevenue,
  OrdersByCategory,
  TopSellingItem,
} from '@/types/menu'
import type { TopActiveUsers } from '@/types/user'
import type {
  WaiterPerformance,
  WaiterPerformanceSummary,
  WaiterSelfPerformance,
} from '@/types/waiter'

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
  async ordersByCategory(target: string) {
    const data = await apiFetch(`/api/analytics/orders-by-category/${target}`)
    return data as Array<OrdersByCategory>
  },
  async ordersAndRevenue(target: string) {
    const data = await apiFetch(`/api/analytics/orders-and-revenue/${target}`)
    return data as Array<OrdersAndRevenue>
  },
  async waiterSelfPerformance(target: string) {
    const data = await apiFetch(
      `/api/analytics/waiter-self-performance/${target}`,
    )
    return data as Array<WaiterSelfPerformance>
  },
  async waiterPerformance(target: string) {
    const data = await apiFetch(`/api/analytics/waiter-performance/${target}`)
    return data as Array<WaiterPerformance>
  },
  async waiterPerformanceSummary() {
    const data = await apiFetch(`/api/analytics/waiter-performance-summary`)
    return data as Array<WaiterPerformanceSummary>
  },
  async topSellingItems() {
    const data = await apiFetch(`/api/analytics/top-selling-items`)
    return data as Array<TopSellingItem>
  },
  async topActiveUsers() {
    const data = await apiFetch(`/api/analytics/top-active-users`)
    return data as Array<TopActiveUsers>
  },
  totalRevenue: async () => {
    const data = await apiFetch(`/api/analytics/total-revenue`)
    return data as number
  },
  async countActiveOrders() {
    const data = await apiFetch(`/api/analytics/count-active-orders`)
    return data as number
  },
}
