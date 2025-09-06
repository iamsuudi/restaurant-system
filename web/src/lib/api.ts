import { auth } from './http/auth'
import { menu } from './http/menu'
import { user } from './http/user'

export const api = {
  ...auth,
  ...user,
  ...menu,
}
