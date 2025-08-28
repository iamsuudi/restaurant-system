import { useEffect, useState } from 'react'
import type { MenuItem } from '../types'

export default function MenuView() {
  const [menu, setMenu] = useState<Array<MenuItem>>([])

  useEffect(() => {
    fetch('http://localhost:8080/api/menu', { credentials: 'include' })
      .then((res) => res.json())
      .then((data: Array<MenuItem>) => setMenu(data))

    const ws = new WebSocket('ws://localhost:8080/ws/menu')
    ws.onmessage = (e) => {
      const evt = JSON.parse(e.data)
      if (evt.type === 'menu_updated') {
        setMenu(evt.payload)
      }
    }
    return () => ws.close()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold">Live Menu</h2>
      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            {item.name} – ${item.price / 100}
          </li>
        ))}
      </ul>
    </div>
  )
}
