import { format } from 'date-fns'
import _ from 'lodash'
import { ChefHat, User, UtensilsCrossed } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Log } from '@/types/log'
import { cn } from '@/lib/utils'
import { query } from '@/hooks/query'

export function TargetRenderer({ log }: { log: Log }) {
  const { data: me } = query.currentUserQuery()

  switch (log.object_type) {
    case 'user':
      return (
        <p className="relative text-gray-500 flex items-center gap-1">
          <User className="size-3" />
          <span>user</span>
          {me?.id === log.target_user_id ? (
            <Link
              to="/dashboard/profile"
              className="ml-2 text-foreground hover:underline hover:text-primary"
            >
              {_.startCase(log.target_user_name)}
            </Link>
          ) : (
            <p className="ml-2 text-foreground hover:underline hover:text-primary">
              {_.startCase(log.target_user_name)}
            </p>
          )}
        </p>
      )
    case 'menu':
      return (
        <p className="relative text-gray-500 flex items-center gap-1">
          <UtensilsCrossed className="size-3" />
          <span>menu</span>
          <p className="ml-2 text-foreground hover:underline hover:text-primary">
            {_.startCase(log.target_menu_name)}
          </p>
        </p>
      )
    case 'order':
      return (
        <p className="relative text-gray-500 flex items-center gap-1">
          <ChefHat className="size-3" />
          <span>order</span>
          <p className="italtic ml-2 text-foreground hover:underline hover:text-primary">
            #{log.target_order_id}
          </p>
        </p>
      )
    default:
      return null
  }
}

export function DateRenderer({ date }: { date: string }) {
  return (
    <p className="relative group w-40 text-gray-500">
      <span className="">{format(date, 'hh:mm a, d MMM yyyy')}</span>
    </p>
  )
}

export function ActionRenderer({ action }: { action: string }) {
  action = _.lowerCase(action)
  return (
    <button
      className={cn('rounded-md flex items-center gap-3 w-fit py-1 px-3', {
        'bg-sky-100': action.startsWith('update'),
        'bg-orange-100': action.startsWith('override'),
        'bg-green-100':
          action.startsWith('create') ||
          action.startsWith('grant') ||
          action.startsWith('assign') ||
          action.startsWith('verif') ||
          action.startsWith('add'),
        'bg-red-100':
          action.startsWith('delete') ||
          action.startsWith('revoke') ||
          action.startsWith('reset') ||
          action.startsWith('reject') ||
          action.startsWith('remove'),
      })}
    >
      <span
        className={cn('text-background size-2 rounded-full', {
          'bg-sky-500': action.startsWith('update'),
          'bg-orange-500': action.startsWith('override'),
          'bg-green-500':
            action.startsWith('create') ||
            action.startsWith('grant') ||
            action.startsWith('assign') ||
            action.startsWith('verif') ||
            action.startsWith('add'),
          'bg-red-500':
            action.startsWith('delete') ||
            action.startsWith('revoke') ||
            action.startsWith('reject') ||
            action.startsWith('reset') ||
            action.startsWith('remove'),
        })}
      ></span>
      <span className="text-gray-700">{action.split(' ').at(0)}</span>
    </button>
  )
}
