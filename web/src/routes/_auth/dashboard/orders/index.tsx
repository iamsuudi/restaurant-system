import { createFileRoute, useRouter } from '@tanstack/react-router'
import { RotateCcw, Search } from 'lucide-react'
import { useState } from 'react'
import { OrdersTable } from '../-order-table'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth/dashboard/orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const { data, error, refetch, isRefetching } = query.listOrders(page, 10)
  const { data: user } = query.currentUserQuery()

  return (
    <div className="px-5 py-16">
      <div className="max-w-screen-md w-full mx-auto space-y-16">
        <div className="flex justify-between">
          <h1 className="font-black text-2xl">
            {user?.role == 'kitchen'
              ? 'Kitchen Orders Management'
              : 'Active Orders'}
          </h1>
          {user?.role == 'waiter' && (
            <div className="flex items-center gap-4">
              <Button
                variant={'outline'}
                size={'icon'}
                onClick={() => refetch()}
              >
                <RotateCcw className={cn({ 'animate-spin': isRefetching })} />
              </Button>
              <Button
                onClick={() => router.navigate({ to: '/dashboard/menu' })}
              >
                Create Order
              </Button>
            </div>
          )}
        </div>
        <div className="shadow-none mx-auto space-y-5">
          {data?.count == 0 ? (
            <div className="w-full h-40 flex flex-col gap-10 items-center justify-center opacity-70">
              <Search className="size-20 opacity-60" />
              No order recorded yet.
            </div>
          ) : (
            <OrdersTable data={data} page={page} setPage={setPage} />
          )}
          <div className="flex justify-center">
            {error && <ErrorComponent error={error} />}
          </div>
        </div>
      </div>
    </div>
  )
}
