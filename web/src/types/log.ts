export interface Log {
  id: string
  actor_id?: string
  actor_role?: string
  action_type: string
  object_type: string
  object_id?: any
  target_order_id: string
  diff: any
  ts: string
}
