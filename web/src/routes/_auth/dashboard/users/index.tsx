import { Link, createFileRoute } from '@tanstack/react-router'
import { RotateCcw, UserSearch } from 'lucide-react'
import _ from 'lodash'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { CreateDialog } from './-create'
import { EditDialog } from './-edit'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'
import { RoleRender } from '@/components/role-render'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_auth/dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: me } = query.currentUserQuery()
  const { data, error, refetch, isRefetching } = query.usersQuery()

  return (
    <div className="p-5">
      <div className="max-w-screen-lg mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="font-black text-2xl">System Users</h1>
          <div className="flex items-center gap-4">
            <Button variant={'outline'} size={'icon'} onClick={() => refetch()}>
              <RotateCcw className={cn({ 'animate-spin': isRefetching })} />
            </Button>
            <CreateDialog />
          </div>
        </div>
        <div>
          {data?.length == 0 ? (
            <div className="w-full h-80 flex flex-col gap-10 items-center justify-center opacity-70">
              <UserSearch className="size-20 opacity-60" />
              No users registered yet.
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <img
                          src={`${import.meta.env.VITE_ASSETS_HOST}/${user.picture}`}
                          className="bg-secondary object-cover size-10 rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {me?.id === user.id ? (
                          <Link to="/dashboard/profile">{user.name}</Link>
                        ) : (
                          <EditDialog id={user.id}>
                            <span className="hover:cursor-pointer">
                              {user.name}
                            </span>
                          </EditDialog>
                        )}
                      </TableCell>
                      <TableCell className="">
                        <RoleRender role={user.role} />
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="">{user.phone}</TableCell>
                      <TableCell className="">
                        <StatusRender id={user.id} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex justify-center">
          {error && <ErrorComponent error={error} />}
        </div>
      </div>{' '}
    </div>
  )
}

export const StatusRender = ({ id }: { id: number }) => {
  const { data: me } = query.currentUserQuery()
  const { data: user } = query.userQuery(id)
  const { mutate, isPending, isSuccess, error } = query.toggleUserStatus(id)

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
      onClick={() => mutate()}
      disabled={isPending || me?.id === id}
      className={cn(
        'flex items-center gap-2 py-0.5 px-3 rounded-full w-fit text-xs hover:cursor-pointer focus:cursor-pointer mx-auto',
        {
          'bg-red-100': user?.blocked == true,
          'bg-green-100': user?.blocked == false,
        },
      )}
    >
      <span
        className={cn('size-2 rounded-full animate-pulse', {
          'bg-red-500': user?.blocked == true,
          'bg-green-500': user?.blocked == false,
        })}
      />
      <span
        className={cn('mt-1', {
          'text-red-500': user?.blocked == true,
          'text-green-500': user?.blocked == false,
        })}
      >
        {_.capitalize(user?.blocked ? 'Blocked' : 'Active')}
      </span>
    </button>
  )
}
