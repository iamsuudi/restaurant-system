import * as React from 'react'
import {
  BookOpen,
  Bot,
  ChefHat,
  Home,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
  TrendingUp,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react'

import _ from 'lodash'
import { Link, useLocation } from '@tanstack/react-router'
import { NavSecondary } from '@/components/nav-secondary'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { query } from '@/hooks/query'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      name: 'Menu',
      url: '/dashboard/menu',
      icon: UtensilsCrossed,
    },
    {
      name: 'Orders',
      url: '/dashboard/orders',
      icon: ChefHat,
    },
    {
      name: 'Analytics',
      url: '/dashboard/analytics',
      icon: TrendingUp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = query.currentUserQuery()
  const location = useLocation()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="px-0">
        <SidebarMenu className="">
          <SidebarMenuItem className="">
            <SidebarMenuButton size="lg" asChild className="">
              <a href="">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Utensils className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Restaurant</span>
                  <span className="truncate text-xs">
                    {_.capitalize(user?.role)}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-5 px-2">
        <SidebarMenu className="space-y-1">
          {data.projects.map((item) => {
            const isActive = item.url === location.pathname

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive}
                  asChild
                  className="group"
                >
                  <Link to={item.url}>
                    <item.icon className="text-primary group-data-[active=true]:text-background" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
