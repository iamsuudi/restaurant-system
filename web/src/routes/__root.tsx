import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'

interface RootContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="restaurant-ui-theme">
      <Outlet />
    </ThemeProvider>
  ),
})
