import { createFileRoute } from '@tanstack/react-router'
import CreateOrder from '@/components/create-order'
import MenuView from '@/components/menu-view'
import UpdateMenu from '@/components/update-menu'
import OrdersView from '@/components/orders-view'

export const Route = createFileRoute('/')({
  component: App,
})

export default function App() {
  return (
    <div className="p-4 space-y-6">
      <CreateOrder />
      <OrdersView />
      <MenuView />
      <UpdateMenu />
    </div>
  )
}
