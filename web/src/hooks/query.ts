import { auth } from './queries/auth'
import { user } from './queries/user'

export const query = {
  ...user,
  ...auth,
}

export { currentUserQueryOptions } from './queries/auth'
