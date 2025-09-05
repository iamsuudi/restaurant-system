import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '@/lib/api'
import { queryClient } from '@/main'

export const currentUserQueryOptions = queryOptions({
  queryKey: queryKeys.me(),
  queryFn: () => api.getMe(),
  staleTime: Infinity,
})

export const auth = {
  currentUserQuery() {
    return useQuery({
      queryKey: queryKeys.me(),
      queryFn: () => api.getMe(),
      staleTime: Infinity,
    })
  },

  loginMutation(onSuccess: () => void) {
    return useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) =>
        api.login(email, password),
      onSuccess: async (user) => {
        await queryClient.setQueryData(queryKeys.me(), user)
        onSuccess()
      },
    })
  },

  logoutMutation(onSuccess: () => Promise<void>) {
    return useMutation({
      mutationFn: api.logout,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.me(),
        })
        await onSuccess()
      },
    })
  },
}
