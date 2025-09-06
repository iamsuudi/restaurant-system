import { Link, createFileRoute } from '@tanstack/react-router'
import { ExternalLink, UserSearch } from 'lucide-react'
import _ from 'lodash'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'
import { RoleRender } from '@/components/role-render'

export const Route = createFileRoute('/_auth/dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, error } = query.usersQuery()

  return (
    <div>
      <div>
        <Card className="shadow border-none max-w-screen-xl mx-auto my-16">
          <CardTitle className="text-center text-xl">System Users</CardTitle>
          <CardContent>
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
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((user) => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <img
                            src={user.picture}
                            className="bg-fuchsia-500 object-cover size-10 rounded-full"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="">
                          <RoleRender role={user.role} />
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="">{user.phone}</TableCell>
                        <TableCell>
                          <Link
                            to={`/dashboard/users/$id`}
                            params={{ id: user.id.toString() }}
                            className="text-blue-500 hover:underline"
                          >
                            Detail{' '}
                            <ExternalLink className="size-4 inline mb-1" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {error && <ErrorComponent error={error} />}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
