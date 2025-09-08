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
