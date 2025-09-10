import { createFileRoute, notFound } from '@tanstack/react-router'
import { EditOrder } from './-edit'

export const Route = createFileRoute('/_auth/dashboard/orders/$id')({
  beforeLoad: ({ params: { id } }) => {
    if (!id) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <div className="p-5">
      <EditOrder id={Number(id)} />
    </div>
  )
}
