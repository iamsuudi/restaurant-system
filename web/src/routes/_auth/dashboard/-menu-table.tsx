import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { EditDialog } from './menu/-edit'
import type { Menu } from '@/types/menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ImageZoom } from '@/components/image-zoom'
import { StatusRender } from '@/components/menu-item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export const KitchenMenuTable = ({ data }: { data?: Array<Menu> }) => {
  return (
    <Table className="text-sm rounded-2xl">
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead className="w-32 text-center">Item</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-32 text-center">Status</TableHead>
          <TableHead className="w-24 text-end">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((menu) => {
          return (
            <TableRow key={menu.id}>
              <TableCell className="flex justify-center">
                <ImageZoom>
                  <img
                    width={800}
                    height={800}
                    src={`${import.meta.env.VITE_ASSETS_HOST}/${menu.picture}`}
                    className="bg-orange-500 object-cover size-10 rounded-full"
                  />
                </ImageZoom>
              </TableCell>
              <TableCell className="font-medium">
                <EditDialog id={menu.id}>
                  <p className="hover:cursor-pointer hover:underline">
                    {menu.name}r
                  </p>
                </EditDialog>
              </TableCell>
              <TableCell className="">
                <StatusRender id={menu.id} status={menu.status} />
              </TableCell>
              <TableCell className="text-end font-mono">
                {menu.price.toFixed(2)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

interface Order {
  menu: Menu
  count: number
}

export const WaiterMenuTable = ({ data }: { data?: Array<Menu> }) => {
  const [selectedMenu, setSelectedMenu] = useState<Array<Order>>([])
  const [note, setNote] = useState('')

  return (
    <div className="w-full flex flex-col gap-10 md:flex-row">
      <Tabs defaultValue="appetizers" className="flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
          <TabsTrigger value="main">Main Courses</TabsTrigger>
          <TabsTrigger value="desserts">Desserts</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
        </TabsList>
        <TabsContent value="main" className="py-5">
          {data?.map((menu) => (
            <div className="w-40 space-y-4">
              <img
                src={`${import.meta.env.VITE_ASSETS_HOST}/${menu.picture}`}
                onClick={() => {
                  if (!selectedMenu.some((item) => item.menu.id === menu.id)) {
                    setSelectedMenu([...selectedMenu, { menu, count: 1 }])
                  } else {
                    setSelectedMenu(
                      selectedMenu.map((item) =>
                        item.menu.id === menu.id
                          ? { ...item, count: item.count + 1 }
                          : item,
                      ),
                    )
                  }
                }}
                className=" rounded-xl size-40"
              />
              <div>
                <MenuDetail menu={menu}>
                  <p className="font-bold">{menu.name}</p>
                </MenuDetail>
                <p className="text-gray-500 text-sm text-ellipsis h-10 overflow-clip">
                  {menu.description}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <OrderBox
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        note={note}
        setNote={setNote}
      />
    </div>
  )
}

function OrderBox({
  selectedMenu,
  setSelectedMenu,
  note,
  setNote,
}: {
  selectedMenu: Array<Order>
  setSelectedMenu: React.Dispatch<React.SetStateAction<Array<Order>>>
  note: string
  setNote: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 shadow-xl rounded-2xl max-w-sm">
      <p className="font-bold text-2xl">Order Summary</p>
      <div>
        {selectedMenu.map((order) => (
          <div key={order.menu.id} className="flex justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-medium">
                {order.menu.name} x {order.count}
              </p>
              <div className="flex items-center text-sm gap-2">
                <button
                  className="size-6 flex items-center justify-center rounded-full border hover:scale-110"
                  onClick={() => {
                    setSelectedMenu(
                      selectedMenu.map((item) =>
                        item.menu.id == order.menu.id
                          ? { ...item, count: item.count - 1 }
                          : item,
                      ),
                    )
                  }}
                >
                  <Minus className="size-4 text-destructive" />
                </button>
                <button className="size-6 flex justify-center items-center">
                  {order.count}
                </button>
                <button
                  className="size-6 flex items-center justify-center rounded-full border hover:scale-110"
                  onClick={() => {
                    setSelectedMenu(
                      selectedMenu.map((item) =>
                        item.menu.id == order.menu.id
                          ? { ...item, count: item.count + 1 }
                          : item,
                      ),
                    )
                  }}
                >
                  <Plus className="size-4 text-green-500" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm">{order.menu.price}</span>
              <button
                className="size-6 flex items-center justify-center hover:scale-110"
                onClick={() => {
                  setSelectedMenu(
                    selectedMenu.filter(
                      (item) => item.menu.id != order.menu.id,
                    ),
                  )
                }}
              >
                <Trash2 className="size-5 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add note about the order"
        className="bg-secondary"
      />

      <Separator />

      <div>
        <p className="flex justify-between text-sm text-gray-500">
          <span className="italic">Subtotal</span>
          <span className="font-mono">
            {selectedMenu
              .reduce((acc, order) => acc + order.menu.price * order.count, 0)
              .toFixed(2)}
          </span>
        </p>
        <p className="flex justify-between text-sm text-gray-500">
          <span className="italic">Tax (%5)</span>
          <span className="font-mono">
            {selectedMenu
              .reduce(
                (acc, order) => acc + order.menu.price * order.count * 0.05,
                0,
              )
              .toFixed(2)}
          </span>
        </p>
        <p className="flex justify-between text-md font-bold mt-2">
          <span>Total</span>
          <span>
            {(
              selectedMenu.reduce(
                (acc, order) => acc + order.menu.price * order.count,
                0,
              ) * 1.05
            ).toFixed(2)}
          </span>
        </p>
      </div>
      <Button>Submit Order</Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setSelectedMenu([])}
        >
          Clear
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setSelectedMenu([])}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

function MenuDetail({
  menu,
  children,
}: {
  menu: Menu
  children: React.ReactNode
}) {
  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="">
        <div className="flex flex-wrap justify-center gap-10 text-xl py-10 px-5">
          <img
            width={800}
            height={800}
            src={`${import.meta.env.VITE_ASSETS_HOST}/${menu.picture}`}
            className="bg-orange-500 object-cover sm:max-w-60 max-h-60 min-w-60"
          />
          <div className="min-w-60 sm:max-w-60 w-full space-y-2">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Name</span>
              <span className="font-black">{menu.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Price</span>
              <span className="font-black">{menu.price.toFixed(2)} Birr</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Category</span>
              <span className="font-black">Food</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Ingredients</span>
              <div className="flex flex-wrap gap-5 font-medium mt-2">
                {menu.ingredients?.map((item) => (
                  <span className="bg-primary text-background py-0.5 px-3 text-xs rounded-full w-fit">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="sm:max-w-xl mx-auto">
          {menu.description}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
