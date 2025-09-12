import { activity } from './http/activity'
import { analytics } from './http/analytics'
import { auth } from './http/auth'
import { menu } from './http/menu'
import { order } from './http/order'
import { user } from './http/user'

export const api = {
  ...auth,
  ...user,
  ...menu,
  ...order,
  ...activity,
  ...analytics,
}
