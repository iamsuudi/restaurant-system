export interface WaiterPerformanceSummary {
  id: string
  name: string
  picture: string
  created_orders: number
  updated_orders: number
  status_updates: number
  total_actions: number
}

export interface WaiterPerformance {
  id: string
  name: string
  picture: string
  period: string
  created_orders: number
  updated_orders: number
  status_updates: number
  total_actions: number
}

export type WaiterSelfPerformance = Omit<
  WaiterPerformance,
  'id' | 'name' | 'picture'
>
