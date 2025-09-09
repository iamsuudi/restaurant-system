import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import type { OrderPayload } from '@/types/order'
import { api } from '@/lib/api'
import { queryClient } from '@/main'

export const order = {
  createOrder() {
    return useMutation({
      mutationFn: (data: OrderPayload) => api.createOrder(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders() })
      },
    })
  },
  listOrders() {
    return useQuery({
      queryKey: queryKeys.orders(),
      queryFn: () => api.listOrders(),
    })
  },
  listCompletedOrders() {
    return useQuery({
      queryKey: queryKeys.completedOrders(),
      queryFn: () => api.listCompletedOrders(),
    })
  },
  getOrder(id: number) {
    return useQuery({
      queryKey: queryKeys.order(id),
      queryFn: () => api.getOrder(id),
    })
  },
  updateOrder(id: number) {
    return useMutation({
      mutationFn: (data: OrderPayload) => api.updateOrder(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders() })
        queryClient.invalidateQueries({ queryKey: queryKeys.order(id) })
      },
    })
  },
  deleteOrder(id: number) {
    return useMutation({
      mutationFn: () => api.deleteOrder(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders() })
        queryClient.invalidateQueries({ queryKey: queryKeys.order(id) })
      },
    })
  },
}
