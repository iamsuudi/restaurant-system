import { createFileRoute, redirect } from '@tanstack/react-router'
import { MessageCircleQuestion, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { currentUserQueryOptions } from '@/hooks/query'

export const Route = createFileRoute('/blocked')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient

    const data = await queryClient.fetchQuery(currentUserQueryOptions)

    if (!data) {
      throw redirect({
        to: '/',
      })
    } else if (!data.blocked) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20">
      <ShieldX className="opacity-80 size-40 stroke-1" />
      <h1 className="text-2xl font-black mt-6">Blocked!</h1>
      <p className="text-md">
        You have been blocked from accessing this system.
      </p>
      <a href="mailto://admin@example.com">
        <Button size="lg" className="flex items-center mt-4">
          <MessageCircleQuestion />
          Contact Support
        </Button>
      </a>
    </div>
  )
}
