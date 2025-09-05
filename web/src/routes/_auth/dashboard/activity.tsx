import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/dashboard/activity"!</div>
}
