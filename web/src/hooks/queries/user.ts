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
            queryKey: queryKeys.logs(1, 10),
          })
        }
      },
    })
  },
}
