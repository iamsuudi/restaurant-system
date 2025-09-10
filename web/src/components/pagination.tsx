import { format } from 'date-fns'
import _ from 'lodash'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UtensilsCrossed,
} from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import type { Log } from '@/types/log'
import { cn } from '@/lib/utils'

export function TargetRenderer({ audit }: { audit: Log }) {
  return (
    <p className="relative text-gray-500 flex items-center gap-1">
      <UtensilsCrossed className="size-3" />
      <span>Order</span>
      <Link
        to={'/dashboard/orders/$id'}
        params={{ id: audit.target_order_id }}
        className="ml-2 text-foreground hover:underline hover:text-primary italic"
      >
        #{audit.target_order_id}
      </Link>
    </p>
  )
}

export function DateRenderer({ date }: { date: string }) {
  return (
    <p className="relative group w-40 text-gray-500">
      <span className="">{format(date, 'hh:mm a, d MMM yyyy')}</span>
    </p>
  )
}

export function RoleRenderer({ role }: { role: string }) {
  return (
    <p
      className={cn('text-xs w-fit py-0.5 px-2 rounded-sm', {
        ' text-purple-600 bg-purple-100': role === 'admin',
        ' text-pink-600 bg-lime-100': role === 'kitchen',
        ' text-sky-600 bg-sky-100': role === 'waiter',
      })}
    >
      {role}
    </p>
  )
}

export function ActionRenderer({ action }: { action: string }) {
  action = _.lowerCase(action)
  return (
    <button
      className={cn('rounded-md flex items-center gap-3 w-fit py-1 px-3', {
        'bg-sky-100': action.startsWith('update'),
        'bg-orange-100': action.startsWith('override'),
        'bg-green-100':
          action.startsWith('create') ||
          action.startsWith('grant') ||
          action.startsWith('assign') ||
          action.startsWith('verif') ||
          action.startsWith('add'),
        'bg-red-100':
          action.startsWith('delete') ||
          action.startsWith('revoke') ||
          action.startsWith('reset') ||
          action.startsWith('reject') ||
          action.startsWith('remove'),
      })}
    >
      <span
        className={cn('text-background size-2 rounded-full', {
          'bg-sky-500': action.startsWith('update'),
          'bg-orange-500': action.startsWith('override'),
          'bg-green-500':
            action.startsWith('create') ||
            action.startsWith('grant') ||
            action.startsWith('assign') ||
            action.startsWith('verif') ||
            action.startsWith('add'),
          'bg-red-500':
            action.startsWith('delete') ||
            action.startsWith('revoke') ||
            action.startsWith('reject') ||
            action.startsWith('reset') ||
            action.startsWith('remove'),
        })}
      ></span>
      <span className="text-gray-700">{action}</span>
    </button>
  )
}

export function Pagination({
  count,
  page,
  setPage,
}: {
  count: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <Fragment>
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {page} of {getTotalPages(count)}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden w-8 h-8 p-0 lg:flex"
          onClick={() => setPage(0)}
          disabled={!canGetPrevPage(page)}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => setPage(page - 1)}
          disabled={!canGetPrevPage(page)}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => setPage(page + 1)}
          disabled={!canGetNextPage(page, count)}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="hidden w-8 h-8 p-0 lg:flex"
          onClick={() => setPage(getLastPage(count))}
          disabled={!canGetNextPage(page, count)}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </Fragment>
  )
}

const ROWS_PER_PAGE = 10

// 1. Can we go forward?
export const canGetNextPage = (page: number, totalCount: number = 0): boolean =>
  page * ROWS_PER_PAGE < totalCount

// 2. Can we go backward?
export const canGetPrevPage = (page: number): boolean => page > 1

// 3. What is the last page?
export const getLastPage = (totalCount: number = 0): number =>
  Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE))

// Calculates the total number of pages
export const getTotalPages = (
  totalCount: number = 0,
  rowsPerPage: number = 10,
): number => Math.max(1, Math.ceil(totalCount / rowsPerPage))
