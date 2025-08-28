import { useState } from 'react'
import type { MenuItem } from '../types'

export default function UpdateMenu() {
  const [json, setJson] = useState(`[{"id":"m1","name":"Burger","price":250}]`)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const items: Array<MenuItem> = JSON.parse(json)
      await fetch('http://localhost:8080/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items }),
      })
    } catch (err) {
      alert('Invalid JSON')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <h2 className="text-xl font-bold">Update Menu</h2>
      <textarea
        className="border p-2 rounded w-full h-32"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button className="bg-green-500 text-white px-3 py-1 rounded">
        Update
      </button>
    </form>
  )
}
