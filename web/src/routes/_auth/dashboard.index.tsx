import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle,
  FileClock,
  Phone,
  TimerReset,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { query } from '@/hooks/query'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="space-y-5">
      <div className="flex justify-between gap-5">
        <h2 className="font-bold text-2xl">Summary</h2>
        <div className="flex gap-2">
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
      </div>
      <div className="flex flex-wrap gap-10">
        <div className="flex-1 flex items-center gap-4 rounded-lg min-w-60 border p-4">
          <div className="flex justify-center items-center size-10 bg-green-200 rounded-lg mb-auto">
            <CheckCircle className="text-green-600 size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Orders Completed</span>
            <span className="font-black text-2xl">{totalCompletedOrders}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4 rounded-lg min-w-60 border p-4">
          <div className="flex justify-center items-center size-10 bg-blue-200 rounded-lg mb-auto">
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
          <div className="flex justify-center items-center size-10 bg-yellow-200 rounded-lg mb-auto">
            <FileClock className="text-yellow-600 size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Pending Tasks</span>
            <span className="font-black text-2xl">{totalActiveOrders}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Greeting() {
  const { data } = query.currentUserQuery()

  return (
    <div className="flex gap-10 rounded-lg shadow p-5">
      <img
        src={`${import.meta.env.VITE_ASSETS_HOST}/${data?.picture}`}
        className="object-cover size-24 bg-secondary rounded-full"
      />
      <div>
        <p className="font-black text-xl">
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
        <div className="flex gap-7 items-center mt-3 text-foreground/80">
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
