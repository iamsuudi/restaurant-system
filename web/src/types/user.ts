export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  picture: string
  blocked: boolean
}

export interface TopActiveUsers {
  id: number
  name: string
  role: string
  picture: string
  total_actions: number
}
