import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { api } from '@/lib/api'

export const activity = {
  logsQuery(page: number, limit: number = 10) {
    return useQuery({
      queryKey: queryKeys.logs(page, limit),
      queryFn: () => api.getActivityLogs(page, limit),
    })
  },

  logQuery(id: string) {
    return useQuery({
      queryKey: queryKeys.log(id),
      queryFn: () => api.getActivityLog(id),
    })
  },
}
