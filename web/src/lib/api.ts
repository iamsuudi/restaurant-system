import { auth } from './http/auth'
import { user } from './http/user'

export const api = {
  ...auth,
  ...user,
}
