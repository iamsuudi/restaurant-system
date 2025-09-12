export interface Log {
  id: string
  actor_id: number
  actor_name: string
  actor_role: string
  action_type: string
  object_type: string
  target_menu_id?: number
  target_menu_name?: string
  target_user_id?: number
  target_user_name?: string
  target_order_id?: number
  diff: any
  ts: string
}
