import _ from 'lodash'
import { format } from 'date-fns'
import type { Order } from '@/types/order'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { query } from '@/hooks/query'
import { StatusRender } from '@/components/order-item'
import { Pagination } from '@/components/pagination'

export const OrdersTable = ({
  data,
  page,
  setPage,
}: {
  data?: {
    orders: Array<Order>
    count: number
  }
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { data: me } = query.currentUserQuery()

  return (
    <>
      <Table className="text-sm rounded-2xl shadow">
        <TableHeader className="rounded-t-2xl">
          <TableRow className="bg-secondary">
            <TableHead className="w-20 text-center">Table</TableHead>
            <TableHead className="w-20">Time</TableHead>
            <TableHead className="w-40">Items</TableHead>
            <TableHead className="w-40">Note</TableHead>
            <TableHead className="w-20 text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="min-h-80">
          {data?.orders.map((order) => {
            return (
              <TableRow key={order.id}>
                <TableCell className="text-center font-bold text-md">
                  {order.table_number}
                </TableCell>
                <TableCell className="font-medium">
                  {format(order.created_at, 'hh:mm aaa')}
                </TableCell>
                <TableCell className="">
                  <OrderItems id={order.id} />
                </TableCell>
                <TableCell className="italic flex flex-wrap gap-1 overflow-clip min-w-40 text-gray-500">
                  {order.note ? (
                    order.note
                      .split(' ')
                      .map((w, index) => <span key={index + w}>{w}</span>)
                  ) : (
                    <span>No Note</span>
                  )}
                </TableCell>
                <TableCell className="border">
                  <StatusRender
                    id={order.id}
                    role={me?.role}
                    status={order.status}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="w-full flex items-center justify-around">
        <Pagination page={page} setPage={setPage} count={data?.count || 0} />
      </div>
    </>
  )
}

function OrderItems({ id }: { id: number }) {
  const { data } = query.getOrderItems(id)

  return (
    <div className="flex flex-wrap gap-2">
      {data?.map((item) => (
        <div key={item.id} className="flex gap-2">
          <span className="text-primary">{item.quantity} x</span>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  )
}
