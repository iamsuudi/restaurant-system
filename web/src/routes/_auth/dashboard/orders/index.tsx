import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown, RotateCcw, Search } from 'lucide-react'
import { useState } from 'react'
import _ from 'lodash'
import { OrdersTable } from '../-order-table'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/_auth/dashboard/orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [target, setTarget] = useState('pending')
  const [page, setPage] = useState(1)
  const { data, error, refetch, isRefetching } = query.listOrders(
    page,
    10,
    target,
  )

  return (
    <div className="px-5 py-16">
      <div className="max-w-screen-md w-full mx-auto space-y-16">
        <Header
          target={target}
          setTarget={setTarget}
          refetch={() => refetch()}
          isRefetching={isRefetching}
        />
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

function Header({
  target,
  setTarget,
  refetch,
  isRefetching,
}: {
  target: string
  setTarget: React.Dispatch<React.SetStateAction<string>>
  refetch: () => void
  isRefetching: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="font-black text-2xl">Orders</h1>
      <div className="flex items-center gap-4">
        <Button variant={'outline'} size={'icon'} onClick={refetch}>
          <RotateCcw className={cn({ 'animate-spin': isRefetching })} />
        </Button>
        <div className="md:flex gap-2 hidden">
          <Button
            variant={target === 'pending' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('pending')
            }}
            size="sm"
            className="w-20"
          >
            Pending
          </Button>
          <Button
            variant={target === 'processing' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('processing')
            }}
            size="sm"
            className="w-20"
          >
            Processing
          </Button>
          <Button
            variant={target === 'ready' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('ready')
            }}
            size="sm"
            className="w-20"
          >
            Ready
          </Button>
          <Button
            variant={target === 'delivered' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('delivered')
            }}
            size="sm"
            className="w-20"
          >
            Delivered
          </Button>
          <Button
            variant={target === 'cancelled' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('cancelled')
            }}
            size="sm"
            className="w-20"
          >
            Cancelled
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button>
              {_.capitalize(target)} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 mx-5">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-foreground truncate text-sm font-medium">
                Select Status
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <Button
                variant={target === 'pending' ? 'default' : 'outline'}
                onClick={() => {
                  setTarget('pending')
                }}
                size="sm"
                className="w-full"
              >
                Pending
              </Button>
              <Button
                variant={target === 'processing' ? 'default' : 'outline'}
                onClick={() => {
                  setTarget('processing')
                }}
                size="sm"
                className="w-full"
              >
                Processing
              </Button>
              <Button
                variant={target === 'ready' ? 'default' : 'outline'}
                onClick={() => {
                  setTarget('ready')
                }}
                size="sm"
                className="w-full"
              >
                Ready
              </Button>
              <Button
                variant={target === 'delivered' ? 'default' : 'outline'}
                onClick={() => {
                  setTarget('delivered')
                }}
                size="sm"
                className="w-full"
              >
                Delivered
              </Button>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Button
              variant={target === 'cancelled' ? 'default' : 'outline'}
              onClick={() => {
                setTarget('cancelled')
              }}
              size="sm"
              className="w-full"
            >
              Cancelled
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
