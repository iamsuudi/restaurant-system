import { auth } from './queries/auth'
import { menu } from './queries/menu'
import { user } from './queries/user'

export const query = {
  ...user,
  ...auth,
  ...menu,
}

export { currentUserQueryOptions } from './queries/auth'
