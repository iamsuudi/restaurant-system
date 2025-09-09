export interface Order {
  id: number
  table_number: string
  status: string
  total_price: number
  note?: string
  waiter_id?: number
  waiter_name?: string
  created_at: string
  updated_at: string
  delivered_at?: string
}

export interface ItemType {
  menuID: number
  quantity: number
}

export interface OrderPayload {
  table_number: string
  total_price: number
  items: Array<ItemType>
  note?: string
}
