import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '@/lib/api'
import { queryClient } from '@/main'

export const user = {
  createUserMutation() {
    return useMutation({
      mutationFn: (data: FormData) => api.createUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users(),
        })
      },
    })
  },

  usersQuery() {
    return useQuery({
      queryKey: queryKeys.users(),
      queryFn: () => api.getUsers(),
    })
  },

  userQuery(id: number) {
    return useQuery({
      queryKey: queryKeys.user(id),
      queryFn: () => api.getUser(id),
    })
  },

  updateUserInfoMutation(id: number, profile?: boolean) {
    return useMutation({
      mutationFn: (payload: FormData) => api.updateUserInfo(id, payload),
      onSuccess: () => {
        if (profile) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.me(),
          })
        } else {
          queryClient.invalidateQueries({
            queryKey: queryKeys.user(id),
          })
          queryClient.invalidateQueries({
            queryKey: queryKeys.logs(1, 10),
          })
        }
      },
    })
  },

  toggleUserStatus(id: number) {
    return useMutation({
      mutationFn: () => api.toggleUserStatus(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.user(id),
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.users(),
        })
      },
    })
  },
}
