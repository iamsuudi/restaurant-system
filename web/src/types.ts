export type OrderStatus = 'pending' | 'in_process' | 'ready'

export interface Order {
  id: string
  table: string
  items: Array<string>
  status: OrderStatus
}

export interface MenuItem {
  id: string
  name: string
  price: number // cents
}
