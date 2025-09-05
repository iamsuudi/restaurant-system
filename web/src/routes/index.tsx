import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

export default function App() {
  return <div className="max-w-screen-lg"></div>
}
