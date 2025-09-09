import { auth } from './queries/auth'
import { menu } from './queries/menu'
import { order } from './queries/order'
import { user } from './queries/user'

export const query = {
  ...user,
  ...auth,
  ...menu,
  ...order,
}

export { currentUserQueryOptions } from './queries/auth'
