import { Link } from '@tanstack/react-router'
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
import { StatusRender } from '@/components/status-render'

export const KitchenMenuTable = ({ data }: { data?: Array<Menu> }) => {
  return (
    <Table className="text-sm rounded-2xl">
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead className="w-20">Item</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-32 text-center">Status</TableHead>
          <TableHead className="w-24 text-end">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((menu) => {
          return (
            <TableRow key={menu.id}>
              <TableCell>
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
                <Link
                  to={`/dashboard/menu/$id`}
                  params={{ id: menu.id.toString() }}
                  className="hover:text-blue-500 hover:underline"
                >
                  {menu.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <StatusRender status={menu.status} />
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

export const WaiterMenuTable = ({ data }: { data?: Array<Menu> }) => {
  return (
    <Table className="text-sm rounded-2xl">
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead className="w-20">Item</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-24 text-end">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((menu) => {
          return (
            <TableRow key={menu.id}>
              <TableCell>
                <Drawer>
                  <DrawerTrigger>
                    <img
                      src={`${import.meta.env.VITE_ASSETS_HOST}/${menu.picture}`}
                      className="bg-orange-500 object-cover size-10 rounded-full"
                    />
                  </DrawerTrigger>
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
                          <span className="font-black">
                            {menu.price.toFixed(2)} Birr
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Category
                          </span>
                          <span className="font-black">Food</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Ingredients
                          </span>
                          <div className="flex flex-wrap gap-5 font-medium mt-2">
                            {['tomato', 'pepper', 'onion'].map((item) => (
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
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  to={`/dashboard/menu/$id`}
                  params={{ id: menu.id.toString() }}
                  className="hover:text-blue-500 hover:underline"
                >
                  {menu.name}
                </Link>
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
