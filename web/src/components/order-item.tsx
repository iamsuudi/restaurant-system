import _ from 'lodash'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { query } from '@/hooks/query'

export const StatusRender = ({
  status,
  role,
  id,
}: {
  status: string
  role?: string
  id: number
}) => {
  const { mutate, isSuccess, isPending, error } = query.updateOrderStatus(id)

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
        let update = status
        switch (status) {
          case 'Pending':
            update = 'Processing'
            break
          case 'Processing':
            update = 'Ready'
            break
          case 'Ready':
            update = 'Delivered'
            break
          case 'Delivered':
            break
        }
        mutate(update)
      }}
      disabled={
        isPending ||
        status === 'Delivered' ||
        (role != 'kitchen' && status !== 'Ready')
      }
      className={cn(
        'flex items-center gap-2 py-1 pl-4 pr-5 rounded-full w-fit text-xs hover:cursor-pointer focus:cursor-pointer mx-auto',
        {
          'bg-gray-100': status == 'Pending',
          'bg-yellow-100': status == 'Processing',
          'bg-sky-100': status == 'Ready',
          'bg-green-100': status == 'Delivered',
        },
      )}
    >
      <span
        className={cn('size-2 rounded-full animate-pulse', {
          'bg-gray-500': status == 'Pending',
          'bg-yellow-500': status == 'Processing',
          'bg-sky-500': status == 'Ready',
          'bg-green-500': status == 'Delivered',
        })}
      />
      <span
        className={cn('mt-1', {
          'text-gray-500': status == 'Pending',
          'text-yellow-500': status == 'Processing',
          'text-sky-500': status == 'Ready',
          'text-green-500': status == 'Delivered',
        })}
      >
        {_.capitalize(status)}
      </span>
    </button>
  )
}

export const DeleteOrder = ({ id }: { id: number }) => {
  const router = useRouter()
  const { mutate, isPending, isSuccess, error } = query.deleteOrder(id)

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successful!')
      router.navigate({ to: '/dashboard/orders' })
    } else if (error) {
      toast.error('Failed: ' + error.message)
    }
  }, [isSuccess, error])

  return (
    <Button
      variant="destructive"
      type="button"
      disabled={isPending}
      onClick={() => mutate()}
      className="hover:cursor-pointer"
    >
      Delete
    </Button>
  )
}
