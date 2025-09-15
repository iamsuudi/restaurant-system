import {
  Link,
  Outlet,
  createFileRoute,
  useRouter,
} from '@tanstack/react-router'
import { Activity, LogOutIcon, UserRoundPen } from 'lucide-react'
import { motion } from 'motion/react'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { query } from '@/hooks/query'
import { ModeToggle } from '@/components/mode-toggle'
import { imageUrl } from '@/lib/utils'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RootComponent,
  notFoundComponent: () => <>Not Found</>,
})

function RootComponent() {
  const router = useRouter()

  const { mutate } = query.logoutMutation(async () => {
    await router.invalidate()
    await router.navigate({ to: '/' })
  })

  const { data } = query.currentUserQuery()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Link to="/dashboard">Home</Link>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={imageUrl(data?.picture || '')} />
                    <AvatarFallback>{data?.name[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="md:w-60 w-48 mx-5 mt-2">
                  <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                      {data?.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                      {data?.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to="/dashboard/profile" className="w-full">
                        <UserRoundPen
                          className="inline mr-2 size-4 opacity-90"
                          aria-hidden="true"
                        />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/dashboard/activity" className="w-full">
                        <Activity
                          className="inline mr-2 size-4 opacity-90"
                          aria-hidden="true"
                        />
                        <span>Activity Logs</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => mutate()}>
                    <LogOutIcon
                      className="size-4 opacity-90"
                      aria-hidden="true"
                    />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
