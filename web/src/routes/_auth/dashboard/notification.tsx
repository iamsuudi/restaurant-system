import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard/notification')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/dashboard/notification"!</div>
}
