import { useEffect, useState } from 'react'
import {
  Cake,
  Cherry,
  CupSoda,
  Hamburger,
  Loader,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react'
import _ from 'lodash'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import type { Menu } from '@/types/menu'
import type { ItemType } from '@/types/order'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { query } from '@/hooks/query'
import { DeleteOrder } from '@/components/order-item'
import { GoBack } from '@/components/goback'

type Item = {
  id: number
  name: string
  category: string
  price: number
  quantity: number
}

export const EditOrder = ({ id }: { id: number }) => {
  const { data: menus } = query.listAllMenu()
  const { data: order } = query.getOrder(id)
  const { data: orderItems } = query.getOrderItems(id)
  const [selectedMenu, setSelectedMenu] = useState<Array<Item>>([])
  const [note, setNote] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [display, setDisplay] = useState(true)

  useEffect(() => {
    if (order) {
      setTableNumber(order.table_number)
      setNote(order.note || '')
    }
    if (orderItems) {
      setSelectedMenu(
        orderItems.map((item) => ({
          id: item.menu_item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
      )
    }
  }, [order, orderItems])

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-10 lg:flex-row justify-center align-center">
      <Tabs defaultValue="appetizer" className="flex-1 overflow-clip">
        <div className="w-full overflow-x-scroll">
          <TabsList className="w-full min-w-sm">
            <TabsTrigger value="appetizer">Appetizers</TabsTrigger>
            <TabsTrigger value="main">Main Courses</TabsTrigger>
            <TabsTrigger value="dessert">Desserts</TabsTrigger>
            <TabsTrigger value="drink">Drinks</TabsTrigger>
          </TabsList>
        </div>
        {['appetizer', 'main', 'dessert', 'drink'].map((tab) => (
          <TabsContent
            value={tab}
            className="py-5 flex flex-wrap justify-center sm:justify-start gap-10 min-h-80"
          >
            {menus
              ?.filter((menu) => menu.category === tab)
              .map((menu) => (
                <MenuBox
                  display={display}
                  setDisplay={setDisplay}
                  selectedMenu={selectedMenu}
                  setSelectedMenu={setSelectedMenu}
                  menu={menu}
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {display && (
        <OrderBox
          id={id}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          note={note}
          setNote={setNote}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
        />
      )}
    </div>
  )
}

function MenuBox({
  display,
  setDisplay,
  selectedMenu,
  setSelectedMenu,
  menu,
}: {
  display: boolean
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>
  selectedMenu: Array<Item>
  setSelectedMenu: React.Dispatch<React.SetStateAction<Array<Item>>>
  menu: Menu
}) {
  return (
    <div className="w-40 space-y-4">
      <img
        src={`${import.meta.env.VITE_ASSETS_HOST}/${menu.picture}`}
        onClick={() => {
          if (!selectedMenu.some((item) => item.id === menu.id)) {
            setSelectedMenu([
              ...selectedMenu,
              {
                id: menu.id,
                name: menu.name,
                category: menu.category,
                price: menu.price,
                quantity: 1,
              },
            ])
          } else {
            setSelectedMenu(
              selectedMenu.map((item) =>
                item.id === menu.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            )
          }
          if (!display) setDisplay(true)
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
  )
}

function OrderBox({
  id,
  selectedMenu,
  setSelectedMenu,
  note,
  setNote,
  tableNumber,
  setTableNumber,
}: {
  id: number
  selectedMenu: Array<Item>
  setSelectedMenu: React.Dispatch<React.SetStateAction<Array<Item>>>
  note: string
  setNote: React.Dispatch<React.SetStateAction<string>>
  tableNumber: string
  setTableNumber: React.Dispatch<React.SetStateAction<string>>
}) {
  const router = useRouter()
  const { mutate, isPending, isSuccess, error } = query.updateOrder(id)

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successful!')
      router.history.back()
    } else if (error) {
      toast.error('Failed: ' + error.message)
    }
  }, [isSuccess, error])

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 shadow border rounded-2xl w-80 max-w-80">
      <p className="font-bold text-2xl underline underline-offset-6">
        Order Summary
      </p>
      <div className="">
        {selectedMenu.map((order, index) => (
          <div
            key={order.id}
            className={cn('flex justify-between py-2', {
              'border-t border-t-secondary': index > 0,
            })}
          >
            <div className="flex flex-col gap-1">
              <p className="font-medium text-md">
                {order.category === 'drink' && (
                  <CupSoda className="size-4 inline mr-2 mb-1" />
                )}
                {order.category === 'dessert' && (
                  <Cake className="size-4 inline mr-2 mb-1" />
                )}
                {order.category === 'main' && (
                  <Hamburger className="size-4 inline mr-2 mb-1" />
                )}
                {order.category === 'appetizer' && (
                  <Cherry className="size-4 inline mr-2 mb-1" />
                )}
                {order.name}{' '}
                <span className="text-primary">x {order.quantity}</span>
              </p>
              <div className="flex items-center text-sm gap-1 pl-7">
                <button
                  className="size-5 flex items-center justify-center rounded-full border hover:scale-110 bg-secondary"
                  onClick={() => {
                    if (order.quantity === 1) {
                      setSelectedMenu(
                        selectedMenu.filter((item) => item.id != order.id),
                      )
                    } else {
                      setSelectedMenu(
                        selectedMenu.map((item) =>
                          item.id == order.id
                            ? { ...item, quantity: item.quantity - 1 }
                            : item,
                        ),
                      )
                    }
                  }}
                >
                  <Minus className="size-4 text-destructive" />
                </button>
                <button className="size-6 flex justify-center items-centeri text-gray-500">
                  {order.quantity}
                </button>
                <button
                  className="size-5 flex items-center justify-center rounded-full border hover:scale-110 bg-secondary"
                  onClick={() => {
                    setSelectedMenu(
                      selectedMenu.map((item) =>
                        item.id == order.id
                          ? { ...item, quantity: item.quantity + 1 }
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
              <span className="font-mono text-sm">
                {order.price.toFixed(2)}
              </span>
              <button
                className="size-6 flex items-center justify-center hover:scale-110"
                onClick={() => {
                  setSelectedMenu(
                    selectedMenu.filter((item) => item.id != order.id),
                  )
                }}
              >
                <Trash2 className="size-5 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Input
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        placeholder="Table Number"
        className="bg-secondary"
      />

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
              .reduce((acc, order) => acc + order.price * order.quantity, 0)
              .toFixed(2)}
          </span>
        </p>
        <p className="flex justify-between text-sm text-gray-500">
          <span className="italic">Tax (%5)</span>
          <span className="font-mono">
            {selectedMenu
              .reduce(
                (acc, order) => acc + order.price * order.quantity * 0.05,
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
                (acc, order) => acc + order.price * order.quantity,
                0,
              ) * 1.05
            ).toFixed(2)}
          </span>
        </p>
      </div>
      <Button
        type="button"
        disabled={isPending || tableNumber === ''}
        onClick={() => {
          let total_price = 0
          const items: Array<ItemType> = []
          selectedMenu.forEach((item) => {
            total_price += item.price * item.quantity
            items.push({
              menu_item_id: item.id,
              quantity: item.quantity,
              price: item.price,
              category: item.category,
            })
          })
          console.log(items)

          mutate({ table_number: tableNumber, total_price, items, note })
        }}
      >
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          'Update Order'
        )}
      </Button>
      <div className="flex justify-end gap-2">
        <DeleteOrder id={id} />
        <GoBack />
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
              <span className="font-black">{_.capitalize(menu.category)}</span>
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
