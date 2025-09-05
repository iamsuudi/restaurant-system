import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'

export const Route = createFileRoute('/')({
  component: App,
})

type User = {
  id: string
  name: string
  email: string
  phone: string
}

type Item = {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

type Order = {
  id: string
  waiter: User
  items: Array<Item>
  status: string
  ts: string
}

const orders: Array<Order> = [
  {
    id: '#12345',
    waiter: {
      id: 'waiter1',
      name: 'Emily Carter',
      email: 'emily@example.com',
      phone: '123-1234-1234',
    },
    items: [
      {
        id: '#chicken_parmesan',
        name: 'Chicken Parmesan',
        price: 15.99,
        quantity: 1,
        notes: 'Extra cheese',
      },
      {
        id: '#caesar_salad',
        name: 'Caesar Salad',
        price: 8.99,
        quantity: 1,
        notes: 'Extra dressing',
      },
    ],
    status: 'pending',
    ts: '10:45 AM',
  },
  {
    id: '2',
    waiter: {
      id: 'waiter2',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-5555-5555',
    },
    items: [
      {
        id: '#pizza',
        name: 'Pizza',
        price: 12.99,
        quantity: 2,
        notes: 'Extra cheese',
      },
      {
        id: '#salad',
        name: 'Salad',
        price: 7.99,
        quantity: 1,
        notes: 'Extra dressing',
      },
    ],
    status: 'pending',
    ts: '11:00 AM',
  },
  {
    id: '3',
    waiter: {
      id: 'waiter3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-6543-2109',
    },
    items: [
      {
        id: '#burger',
        name: 'Burger',
        price: 10.99,
        quantity: 1,
        notes: 'Extra pickles',
      },
      {
        id: '#fries',
        name: 'Fries',
        price: 3.99,
        quantity: 2,
        notes: 'Extra ketchup',
      },
    ],
    status: 'pending',
    ts: '12:00 PM',
  },
  {
    id: '4',
    waiter: {
      id: 'waiter4',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-5555-5555',
    },
    items: [
      {
        id: '#pizza',
        name: 'Pizza',
        price: 12.99,
        quantity: 2,
        notes: 'Extra cheese',
      },
      {
        id: '#salad',
        name: 'Salad',
        price: 7.99,
        quantity: 1,
        notes: 'Extra dressing',
      },
    ],
    status: 'pending',
    ts: '11:00 AM',
  },
]

export default function App() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="p-5 space-y-10">
        <div>
          <p>Active Orders</p>
          <p>Real-time order tracking for kitchen and service staff.</p>
        </div>

        <div className="flex flex-wrap gap-10">
          <div className="bg-gray-100 p-5 shadow-lg space-y-5">
            <div className="flex justify-between">
              <p className="font-bold">New Orders</p>
              <span className="bg-red-500 text-white p-1 rounded-full">3</span>
            </div>

            {orders.map((order) => (
              <div className="flex justify-between bg-white p-3 w-96">
                <div className="flex flex-col">
                  <span className="font-bold">{order.id}</span>
                  <span className="text-stone-600">{order.waiter.name}</span>
                  {order.items.map((item) => (
                    <span className="text-stone-600">{item.name}</span>
                  ))}
                  <span className="text-stone-600 mt-5 text-sm">
                    {order.ts}
                  </span>
                </div>

                <div className="flex flex-col justify-between">
                  <span className="bg-blue-200 text-blue-700 rounded-full text-center">
                    New
                  </span>
                  <button className="text-red-500">Start Prep</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
