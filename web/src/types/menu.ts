export interface Menu {
  id: number
  name: string
  description?: string
  price: number
  status: boolean
  picture: string
  category: string
  ingredients?: Array<string>
}

export interface TopSellingItem {
  id: number
  name: string
  revenue: number
  total_sold: number
}

export interface OrdersByCategory {
  period: string
  category: string
  revenue: number
  total_sold: number
}

export interface OrdersAndRevenue {
  period: string
  total_orders: number
  total_revenue: number
}
