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
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'pending'),
        })
      },
    })
  },
  listOrders(page = 1, limit = 10, target = 'pending') {
    return useQuery({
      queryKey: queryKeys.orders(page, limit, target),
      queryFn: () => api.listOrders(page, limit, target),
    })
  },
  listCompletedOrders(page = 1, limit = 10) {
    return useQuery({
      queryKey: queryKeys.completedOrders(page, limit),
      queryFn: () => api.listCompletedOrders(page, limit),
    })
  },
  getOrder(id: number) {
    return useQuery({
      queryKey: queryKeys.order(id),
      queryFn: () => api.getOrder(id),
    })
  },
  getOrderItems(id: number) {
    return useQuery({
      queryKey: queryKeys.orderItems(id),
      queryFn: () => api.getOrderItems(id),
    })
  },
  updateOrder(id: number) {
    return useMutation({
      mutationFn: (data: OrderPayload) => api.updateOrder(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'pending'),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.order(id) })
      },
    })
  },
  updateOrderStatus(id: number) {
    return useMutation({
      mutationFn: (status: string) => api.updateOrderStatus(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'pending'),
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'processing'),
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'ready'),
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'delivered'),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.order(id) })
      },
    })
  },
  deleteOrder(id: number) {
    return useMutation({
      mutationFn: () => api.deleteOrder(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'pending'),
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders(1, 10, 'cancelled'),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.order(id) })
      },
    })
  },
}
