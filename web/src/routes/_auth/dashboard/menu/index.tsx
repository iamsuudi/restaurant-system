import { Link, createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { CreateDialog } from './-create'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'
import { StatusRender } from '@/components/status-render'

export const Route = createFileRoute('/_auth/dashboard/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, error } = query.listAllMenu()

  return (
    <div className="px-5 py-16">
      <div className="max-w-screen-lg mx-auto space-y-16">
        <div className="flex justify-between">
          <h1 className="font-black text-2xl">Menu Management</h1>
          <CreateDialog />
        </div>
        <Card className="border shadow-none mx-auto">
          <CardContent>
            {data?.length == 0 ? (
              <div className="w-full h-40 flex flex-col gap-10 items-center justify-center opacity-70">
                <Search className="size-20 opacity-60" />
                No menu registered yet.
              </div>
            ) : (
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-secondary">
                    <TableHead className="w-20">Item</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="">Description</TableHead>
                    <TableHead className="w-32 text-center">Status</TableHead>
                    <TableHead className="w-24 text-end">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((menu) => {
                    return (
                      <TableRow key={menu.id}>
                        <TableCell>
                          <img
                            src={`${import.meta.env.VITE_ASSETS_HOST}/${menu.picture}`}
                            className="bg-orange-500 object-cover size-10 rounded-full"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            to={`/dashboard/menu/$id`}
                            params={{ id: menu.id.toString() }}
                            className="hover:text-blue-500 hover:underline"
                          >
                            {menu.name}
                          </Link>
                        </TableCell>
                        <TableCell className="overflow-ellipsis overflow-clip max-w-sm">
                          {menu.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusRender status={menu.status} />
                        </TableCell>
                        <TableCell className="text-end font-mono">
                          {menu.price.toFixed(2)}
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
