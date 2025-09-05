import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-5">
      <div></div>
    </div>
  )
}
