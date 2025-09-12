import _ from 'lodash'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ExternalLink, Loader, RotateCcw, TimerReset } from 'lucide-react'
import { query } from '@/hooks/query'
import { CardFooter } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ActionRenderer,
  DateRenderer,
  TargetRenderer,
} from '@/components/activity'
import { Pagination } from '@/components/pagination'
import { ErrorComponent } from '@/components/error-component'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RoleRender } from '@/components/role-render'

export const Route = createFileRoute('/_auth/dashboard/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isPending, refetch, isRefetching, error } = query.logsQuery(
    currentPage,
    10,
  )
  const { data: me } = query.currentUserQuery()

  return (
    <div className="w-full min-h-screen p-5">
      <div className="max-w-screen-lg mx-auto py-10 space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="font-black text-2xl">Activity Logs</h1>
          <div className="flex flex-wrap `items-center gap-4">
            <Button variant={'outline'} onClick={() => refetch()}>
              <RotateCcw className={cn({ 'animate-spin': isRefetching })} />
              Refetch
            </Button>
          </div>
        </div>
        <div>
          {data?.logs.length == 0 ? (
            <div className="w-full h-80 flex flex-col gap-10 items-center justify-center opacity-70">
              <TimerReset className="size-20 opacity-60" />
              No logs recorded yet.
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead></TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead className="pl-5">Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Timestamp
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.logs.map((log) => {
                  return (
                    <TableRow key={log.id}>
                      <TableCell></TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col items-start">
                          <Link
                            className="hover:underline hover:text-primary"
                            to={
                              me?.id === log.actor_id
                                ? '/dashboard/profile'
                                : '/dashboard/users/$id'
                            }
                            params={{
                              id: log.actor_id,
                            }}
                          >
                            {log.actor_name}
                          </Link>
                          <RoleRender role={log.actor_role} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionRenderer action={log.action_type} />
                      </TableCell>
                      <TableCell className="">
                        <TargetRenderer log={log} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <DateRenderer date={log.ts} />
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/dashboard/activity/$id`}
                          params={{ id: log.id }}
                          className="text-blue-500 hover:underline"
                        >
                          Details{' '}
                          <ExternalLink className="size-4 inline ml-1 mb-1" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
        {data && data.logs.length > 0 && (
          <CardFooter className="flex justify-around">
            <Pagination
              count={data.count}
              page={currentPage}
              setPage={setCurrentPage}
            />
          </CardFooter>
        )}
        {error && (
          <CardFooter className="flex justify-center">
            <ErrorComponent error={error} />
          </CardFooter>
        )}
        {isPending && (
          <CardFooter className="flex justify-center">
            <Loader className="size-24 animate-spin" />
          </CardFooter>
        )}
      </div>
    </div>
  )
}
