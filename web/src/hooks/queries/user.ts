import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '@/lib/api'
import { queryClient } from '@/main'

export const user = {
  createUserMutation() {
    return useMutation({
      mutationFn: (data: FormData) => api.createUser(data),
    })
  },

  usersQuery(page: number, rows: number = 10, query: string = '') {
    return useQuery({
      queryKey: queryKeys.users(page, rows, query),
      queryFn: () => api.getUsers(page, rows, query),
    })
  },

  userQuery(id: string) {
    return useQuery({
      queryKey: queryKeys.user(id),
      queryFn: () => api.getUser(id),
    })
  },

  updateUserInfoMutation(id: string, profile?: boolean) {
    return useMutation({
      mutationFn: (info: {
        first: string
        second: string
        last: string
        email: string
        phone: string
      }) => api.updateUserInfo(id, info),
      onSuccess: async () => {
        if (profile) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.me(),
          })
        } else {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.user(id),
          })
          await queryClient.invalidateQueries({
            queryKey: queryKeys.logs(1, 10).concat('user', id),
          })
        }
      },
    })
  },
}
