import { useEffect, useState } from 'react'
import type { Order, OrderStatus } from '../types'

export default function OrdersView() {
  const [orders, setOrders] = useState<Array<Order>>([])

  useEffect(() => {
    fetch('http://localhost:8080/api/orders', { credentials: 'include' })
      .then((res) => res.json())
      .then((data: Array<Order>) => setOrders(data))

    const ws = new WebSocket('ws://localhost:8080/ws/orders')
    ws.onmessage = (e) => {
      const evt = JSON.parse(e.data)
      if (evt.type === 'order_created') {
        setOrders((prev) => [...prev, evt.payload])
      }
      if (evt.type === 'order_updated') {
        setOrders((prev) =>
          prev.map((o) => (o.id === evt.payload.id ? evt.payload : o)),
        )
      }
    }
    return () => ws.close()
  }, [])

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch(`http://localhost:8080/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Orders</h2>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="border p-2 rounded flex justify-between">
            <span>
              Table {o.table} – {o.items.join(', ')} – <b>{o.status}</b>
            </span>
            <div className="space-x-2">
              {o.status === 'pending' && (
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => updateStatus(o.id, 'in_process')}
                >
                  Start
                </button>
              )}
              {o.status === 'in_process' && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => updateStatus(o.id, 'ready')}
                >
                  Mark Ready
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
