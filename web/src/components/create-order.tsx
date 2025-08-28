import { useState } from 'react'

export default function CreateOrder() {
  const [table, setTable] = useState('')
  const [items, setItems] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        table,
        items: items.split(',').map((i) => i.trim()),
      }),
    })
    setTable('')
    setItems('')
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <h2 className="text-xl font-bold">Create Order</h2>
      <input
        className="border p-1 rounded w-full"
        placeholder="Table"
        value={table}
        onChange={(e) => setTable(e.target.value)}
      />
      <input
        className="border p-1 rounded w-full"
        placeholder="Items (comma separated)"
        value={items}
        onChange={(e) => setItems(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-3 py-1 rounded">
        Place Order
      </button>
    </form>
  )
}
