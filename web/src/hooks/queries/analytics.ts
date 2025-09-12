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
  countActiveOrders: () => {
    return useQuery({
      queryKey: queryKeys.analytics.countActiveOrders(),
      queryFn: () => api.countActiveOrders(),
    })
  },
}
