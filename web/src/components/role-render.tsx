import _ from 'lodash'
import { ChefHat, UserLock, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

export const RoleRender = ({ role }: { role: string }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 py-0.5 px-3 rounded-full w-fit text-xs',
        {
          'bg-orange-200': role === 'kitchen',
          'bg-purple-200': role === 'waiter',
          'bg-rose-200': role === 'admin',
        },
      )}
    >
      {role == 'kitchen' && <ChefHat className="size-4 text-orange-600" />}
      {role == 'waiter' && (
        <UtensilsCrossed className="size-4 text-purple-600" />
      )}
      {role == 'admin' && <UserLock className="size-4 text-rose-600" />}
      <span className="mt-1">{_.capitalize(role)}</span>
    </div>
  )
}
