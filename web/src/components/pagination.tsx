import _ from 'lodash'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { Button } from './ui/button'

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
