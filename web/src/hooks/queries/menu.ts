import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '@/lib/api'
import { queryClient } from '@/main'

export const menu = {
  createMenu() {
    return useMutation({
      mutationFn: (data: FormData) => api.createMenu(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.allmenu() })
      },
    })
  },
  listAllMenu() {
    return useQuery({
      queryKey: queryKeys.allmenu(),
      queryFn: () => api.listAllMenu(),
    })
  },
  getMenu(id: number) {
    return useQuery({
      queryKey: queryKeys.menu(id),
      queryFn: () => api.getMenu(id),
    })
  },
  updateMenu(id: number) {
    return useMutation({
      mutationFn: (data: FormData) => api.updateMenu(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.allmenu() })
      },
    })
  },
  deleteMenu(id: number) {
    return useMutation({
      mutationFn: () => api.deleteMenu(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.allmenu() })
      },
    })
  },
}
