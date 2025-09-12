import { apiFetch } from './wrapper'
import type { Log } from '@/types/log'

export const activity = {
  async getActivityLogs(page: number, limit: number) {
    const data = await apiFetch(`/api/activities?page=${page}&rows=${limit}`)
    return data as { count: number; logs: Array<Log> }
  },
  async getActivityLog(id: string) {
    const data = await apiFetch(`/api/activities/${id}`)
    return data as Log
  },
}
