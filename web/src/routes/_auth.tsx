import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { currentUserQueryOptions } from '@/hooks/query'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient

    const data = await queryClient.fetchQuery(currentUserQueryOptions)

    if (!data) {
      throw redirect({
        to: '/',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.pathname + location.search,
        },
      })
    } else if (data.blocked) {
      throw redirect({
        to: '/blocked',
      })
    }
  },
  component: () => <Outlet />,
})
