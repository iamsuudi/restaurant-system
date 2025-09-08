import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { KitchenMenuTable, WaiterMenuTable } from '../-menu-table'
import { CreateDialog } from './-create'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'

export const Route = createFileRoute('/_auth/dashboard/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, error } = query.listAllMenu()
  const { data: user } = query.currentUserQuery()

  return (
    <div className="px-5 py-16">
      <div className="max-w-screen-xl w-full mx-auto space-y-16">
        <div className="flex justify-between">
          <h1 className="font-black text-2xl">
            {user?.role == 'kitchen'
              ? 'Kitchen Menu Management'
              : 'Available Menu'}
          </h1>
          {user?.role == 'kitchen' && <CreateDialog />}
        </div>
        <div className="shadow-none mx-auto">
          {data?.length == 0 ? (
            <div className="w-full h-40 flex flex-col gap-10 items-center justify-center opacity-70">
              <Search className="size-20 opacity-60" />
              No menu registered yet.
            </div>
          ) : (
            <>
              {user?.role == 'kitchen' ? (
                <KitchenMenuTable data={data} />
              ) : (
                <WaiterMenuTable data={data} />
              )}
            </>
          )}
          <div className="flex justify-center">
            {error && <ErrorComponent error={error} />}
          </div>
        </div>
      </div>
    </div>
  )
}
