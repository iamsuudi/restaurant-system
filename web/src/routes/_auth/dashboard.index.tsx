import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle,
  ChevronDown,
  CircleDollarSignIcon,
  FileClock,
  Phone,
  TimerReset,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import _ from 'lodash'
import { CategoryTotalSold } from './-charts/category-total-sold'
import { CategoryRevenue } from './-charts/category-revenue'
import { query } from '@/hooks/query'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RoleRender } from '@/components/role-render'
import { imageUrl } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/_auth/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-5">
      <div className="max-w-screen-xl mx-auto space-y-20">
        <Greeting />
        <Summary />
      </div>
    </div>
  )
}

function Summary() {
  const [target, setTarget] = useState('daily')
  const { data: totalCompletedOrders } = query.countCompletedOrders(target)
  const { data: avgPrepTime } = query.avgPrepTime(target)
  const { data: totalActiveOrders } = query.countActiveOrders()
  const { data: totalRevenue } = query.totalRevenue()

  return (
    <div className="space-y-10">
      <div className="flex justify-between gap-5">
        <h2 className="font-bold text-2xl">Summary</h2>

        <div className="hidden md:flex gap-2 ">
          <Button
            variant={target === 'daily' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('daily')
            }}
            size="sm"
            className="w-20"
          >
            Daily
          </Button>
          <Button
            variant={target === 'weekly' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('weekly')
            }}
            size="sm"
            className="w-20"
          >
            Weekly
          </Button>
          <Button
            variant={target === 'monthly' ? 'default' : 'outline'}
            onClick={() => {
              setTarget('monthly')
            }}
            size="sm"
            className="w-20"
          >
            Monthly
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button>
              {_.capitalize(target)} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32 mx-5 space-y-1">
            <Button
              variant={target === 'daily' ? 'default' : 'outline'}
              onClick={() => {
                setTarget('daily')
              }}
              size="sm"
              className="w-full"
            >
              Daily
            </Button>
            <Button
              variant={target === 'weekly' ? 'default' : 'outline'}
              onClick={() => {
                setTarget('weekly')
              }}
              size="sm"
              className="w-full"
            >
              Weekly
            </Button>
            <Button
              variant={target === 'monthly' ? 'default' : 'outline'}
              onClick={() => {
                setTarget('monthly')
              }}
              size="sm"
              className="w-full"
            >
              Monthly
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-5">
        <div className="flex items-center gap-4 rounded-lg min-w-60 border p-4">
          <div className="flex justify-center items-center size-10 bg-pink-600/30 rounded-lg mb-auto">
            <CircleDollarSignIcon className="text-pink-600 size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Total Revenue</span>
            <span className="font-black text-2xl">
              {totalRevenue?.toFixed(2) || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg min-w-60 border p-4">
          <div className="flex justify-center items-center size-10 bg-green-600/30 rounded-lg mb-auto">
            <CheckCircle className="text-green-600 size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Orders Completed</span>
            <span className="font-black text-2xl">
              {totalCompletedOrders || 0}
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4 rounded-lg min-w-60 border p-4">
          <div className="flex justify-center items-center size-10 bg-blue-600/30 rounded-lg mb-auto">
            <TimerReset className="text-blue-600 size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Avg. Prep Time</span>
            <span className="font-black text-2xl">
              {avgPrepTime ? Math.floor(avgPrepTime / 60) : '0'} min
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4 rounded-lg min-w-60 border p-4">
          <div className="flex justify-center items-center size-10 bg-yellow-600/30 rounded-lg mb-auto">
            <FileClock className="text-yellow-600 size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Pending Tasks</span>
            <span className="font-black text-2xl">
              {totalActiveOrders || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-10">
        <WaiterPerformanceSummary />
        <TopSellingItems />
        <TopActiveUsers />
      </div>

      <CategoryTotalSold />
      <CategoryRevenue />
    </div>
  )
}

function WaiterPerformanceSummary() {
  const { data: waiterPerformance } = query.waiterPerformanceSummary()

  return (
    <div className="flex-1 flex flex-col gap-5 border rounded-2xl py-5">
      <h2 className="text-xl font-bold px-5">Waiters Performance</h2>
      <Table className="">
        <TableHeader className="bg-primary-foreground">
          <TableRow>
            <TableHead className="min-w-16"></TableHead>
            <TableHead className="w-40">Name</TableHead>
            <TableHead className="text-center">Orders</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waiterPerformance?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex justify-center">
                <img
                  src={`${import.meta.env.VITE_ASSETS_HOST}/${user.picture}`}
                  className="bg-secondary object-cover size-10 rounded-full"
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="text-center">
                {user.created_orders}
              </TableCell>
              <TableCell className="text-center">
                {user.total_actions}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TopSellingItems() {
  const { data: topSellingItems } = query.topSellingItems()

  return (
    <div className="flex-1 flex flex-col gap-5 border rounded-2xl py-5">
      <h2 className="text-xl font-bold px-5">Top Selling Items</h2>
      <Table className="">
        <TableHeader className="bg-primary-foreground">
          <TableRow>
            <TableHead className="text-center min-w-16">ID</TableHead>
            <TableHead className="min-w-32">Name</TableHead>
            <TableHead className="text-center">Revenue</TableHead>
            <TableHead className="text-center">Sold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topSellingItems?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="italic text-center">#{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-center">{item.revenue}</TableCell>
              <TableCell className="text-center">{item.total_sold}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TopActiveUsers() {
  const { data: topActiveUsers } = query.topActiveUsers()

  return (
    <div className="flex-1 flex flex-col gap-5 border rounded-2xl py-5">
      <h2 className="text-xl font-bold px-5">Top Active Users</h2>
      <Table className="">
        <TableHeader className="bg-primary-foreground">
          <TableRow>
            <TableHead className="min-w-16"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topActiveUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex justify-center">
                <img
                  src={imageUrl(user.picture)}
                  className="bg-secondary object-cover size-10 rounded-full"
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <RoleRender role={user.role} />
              </TableCell>
              <TableCell className="text-center">
                {user.total_actions}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function Greeting() {
  const { data } = query.currentUserQuery()

  return (
    <div className="flex gap-5 sm:gap-10 rounded-lg border p-3 sm:p-5">
      <img
        src={`${import.meta.env.VITE_ASSETS_HOST}/${data?.picture}`}
        className="object-cover size-12 sm:size-24 bg-secondary rounded-full"
      />
      <div>
        <p className="font-black text-lg sm:text-xl">
          Welcome back, {data?.name.split(' ')[0]}!
        </p>
        <p className="text-md text-foreground/80 mt-1">
          Ready to{' '}
          {data?.role == 'admin'
            ? 'manage stuffs?'
            : data?.role == 'kitchen'
              ? 'cook up a storm?'
              : 'take some orders?'}
        </p>
        <div className="flex flex-col sm:flex-row gap-x-7 gap-y-2 sm:items-center items-start mt-3 text-foreground/80">
          <p className="flex items-center gap-1 text-sm">
            <UserRound className="size-4" />
            {data?.name}
          </p>
          <p className="flex items-center gap-1 text-sm">
            <Phone className="size-4" />
            {data?.phone}
          </p>
        </div>
      </div>
    </div>
  )
}
