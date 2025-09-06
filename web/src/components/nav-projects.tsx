import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavProjects({
  projects,
}: {
  projects: Array<{
    name: string
    url: string
    icon: LucideIcon
  }>
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = item.url === window.location.pathname

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton isActive={isActive} asChild className="group">
                <Link to={item.url}>
                  <item.icon className="text-primary group-data-[active=true]:text-background" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
