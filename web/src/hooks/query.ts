import { activity } from './queries/activity'
import { analytics } from './queries/analytics'
import { auth } from './queries/auth'
import { menu } from './queries/menu'
import { order } from './queries/order'
import { user } from './queries/user'

export const query = {
  ...user,
  ...auth,
  ...menu,
  ...order,
  ...activity,
  ...analytics,
}

export { currentUserQueryOptions } from './queries/auth'
