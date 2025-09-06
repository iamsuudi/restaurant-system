import { createFileRoute } from '@tanstack/react-router'
import { Phone, UserRound } from 'lucide-react'
import { query } from '@/hooks/query'

export const Route = createFileRoute('/_auth/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = query.currentUserQuery()

  return (
    <div className="p-5">
      <div>
        <div className="flex gap-10 rounded-lg shadow p-5">
          <img
            src={data?.picture}
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
      </div>
    </div>
  )
}
