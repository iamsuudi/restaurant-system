import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '@/lib/api'

export const analytics = {
  countCompletedOrders: (target: string) => {
    return useQuery({
      queryKey: queryKeys.analytics.countCompletedOrders(target),
      queryFn: () => api.countCompletedOrders(target),
    })
  },
  avgPrepTime: (target: string) => {
    return useQuery({
      queryKey: queryKeys.analytics.avgPrepTime(target),
      queryFn: () => api.getAvgPrepTime(target),
    })
  },
  ordersByCategory: (target: string) => {
    return useQuery({
      queryKey: queryKeys.analytics.ordersByCategory(target),
      queryFn: () => api.ordersByCategory(target),
    })
  },
  ordersAndRevenue: (target: string) => {
    return useQuery({
      queryKey: queryKeys.analytics.ordersAndRevenue(target),
      queryFn: () => api.ordersAndRevenue(target),
    })
  },
  waiterSelfPerformance: (target: string, id?: number) => {
    return useQuery({
      queryKey: queryKeys.analytics.waiterSelfPerformance(target, id),
      queryFn: () => api.waiterSelfPerformance(target),
      enabled: !!id,
    })
  },
  waiterPerformance: (target: string) => {
    return useQuery({
      queryKey: queryKeys.analytics.waiterPerformance(target),
      queryFn: () => api.waiterPerformance(target),
    })
  },
  waiterPerformanceSummary: () => {
    return useQuery({
      queryKey: queryKeys.analytics.waiterPerformanceSummary(),
      queryFn: () => api.waiterPerformanceSummary(),
    })
  },
  countActiveOrders: () => {
    return useQuery({
      queryKey: queryKeys.analytics.countActiveOrders(),
      queryFn: () => api.countActiveOrders(),
    })
  },
  topSellingItems: () => {
    return useQuery({
      queryKey: queryKeys.analytics.topSellingItems(),
      queryFn: () => api.topSellingItems(),
    })
  },
  topActiveUsers: () => {
    return useQuery({
      queryKey: queryKeys.analytics.topActiveUsers(),
      queryFn: () => api.topActiveUsers(),
    })
  },
  totalRevenue: () => {
    return useQuery({
      queryKey: queryKeys.analytics.totalRevenue(),
      queryFn: () => api.totalRevenue(),
    })
  },
}
