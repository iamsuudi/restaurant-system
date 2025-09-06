import _ from 'lodash'
import { cn } from '@/lib/utils'

export const StatusRender = ({ status }: { status: boolean }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 py-0.5 px-3 rounded-full w-fit text-xs',
        {
          'bg-red-100': status == false,
          'bg-green-100': status == true,
        },
      )}
    >
      {status ? (
        <span className="size-2 bg-green-500 rounded-full animate-pulse" />
      ) : (
        <span className="size-2 bg-red-500 rounded-full animate-pulse" />
      )}
      <span
        className={cn('mt-1', {
          'text-red-500': status == false,
          'text-green-500': status == true,
        })}
      >
        {_.capitalize(status ? 'Available' : 'Not Available')}
      </span>
    </div>
  )
}
