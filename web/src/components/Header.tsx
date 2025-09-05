export default function Header() {
  return (
    <div className="flex justify-between px-4 py-2 border-b border-b-accent bg-gray-200">
      <p className="font-bold text-xl">Restaurant</p>
      <div className="flex tems-center text-xs gap-2">
        <a>Dashboard</a>
        <a>Orders</a>
        <a>Menus</a>
      </div>
      <div>
        <img src="/profile.png" className="w-8 h-8 bg-gray-400 rounded-full" />
      </div>
    </div>
  )
}
