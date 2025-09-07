import _ from 'lodash'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { query } from '@/hooks/query'

export const StatusRender = ({
  status,
  id,
}: {
  status: boolean
  id: number
}) => {
  const { mutate, isSuccess, isPending, error } = query.updateMenu(id)

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successful!')
    } else if (error) {
      toast.error('Failed: ' + error.message)
    }
  }, [isSuccess, error])

  return (
    <button
      type="button"
      onClick={() => {
        const fd = new FormData()
        fd.append('status', status ? 'false' : 'true')
        mutate(fd)
      }}
      disabled={isPending}
      className={cn(
        'flex items-center gap-2 py-0.5 px-3 rounded-full w-fit text-xs hover:cursor-pointer focus:cursor-pointer mx-auto',
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
    </button>
  )
}
