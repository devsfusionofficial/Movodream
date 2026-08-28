'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  title?: string
  description?: string
  searchable?: boolean
  searchPlaceholder?: string
  searchColumnId?: string
  emptyMessage?: string
  headerActions?: React.ReactNode
  defaultPageSize?: number
}

export function DataTable<TData>({
  columns,
  data,
  title,
  description,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchColumnId,
  emptyMessage = 'No results found.',
  headerActions,
  defaultPageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Clean search placeholder if it contains garbled characters
  const cleanPlaceholder = (searchPlaceholder || 'Search...').replace(/\?|\?|\?/g, '...')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const hasSearch = searchable || Boolean(searchColumnId)
  const hasHeader = title || description || headerActions || hasSearch
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex

  return (
    <div className="space-y-3 font-sans">
      {hasHeader && (
        <div className="flex flex-col gap-4 border-b border-[#f0edf1] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-[15px] font-semibold text-[#2b2032]">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-[#978e9e]">{description}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasSearch && (
              <div className="relative w-full min-w-0 max-w-xs sm:w-64">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#858b8f]" />
                <input
                  type="text"
                  placeholder={cleanPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="h-9 w-full rounded-xl border border-[#dedede] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#d71789] transition-colors"
                />
                {globalFilter && (
                  <button
                    type="button"
                    onClick={() => setGlobalFilter('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {headerActions}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#ebe6ee] bg-white shadow-xs">
        <Table>
          <TableHeader className="bg-[#fbf9fc]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-[#ebe6ee]">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`h-9 px-3 text-xs font-bold text-[#21182a] ${
                      header.column.id === 'actions' ? 'w-px text-right' : ''
                    } ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-[#d71789]' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-[#f3eff4] last:border-0 hover:bg-[#fcf9fc] transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === 'actions'
                          ? 'w-px whitespace-nowrap px-3 py-2.5 text-right [&>div]:justify-end'
                          : 'px-3 py-2.5 text-sm text-[#2b2032]'
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-[#887f8e]">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1 text-xs text-[#887f8e]">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            Showing <strong className="text-[#21182a]">{table.getRowModel().rows.length}</strong> of{' '}
            <strong className="text-[#21182a]">{data.length}</strong> records
          </span>

          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5 border-l border-[#e8e1ea] pl-3">
            <span>Rows:</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(val) => val && table.setPageSize(Number(val))}
            >
              <SelectTrigger size="sm" className="h-7 w-16 rounded-lg border-[#dedede] bg-white text-xs font-semibold text-[#21182a]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs text-[#887f8e]">
            Page <strong className="text-[#21182a]">{pageCount > 0 ? pageIndex + 1 : 0}</strong> of{' '}
            <strong className="text-[#21182a]">{pageCount}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 gap-1 rounded-lg border-[#e6e1e9] text-xs font-medium hover:bg-[#fce8f2] hover:text-[#d71789] disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>

          {/* Page numbers */}
          {pageCount > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => table.setPageIndex(i)}
                  className={`h-7 w-7 rounded-lg text-xs font-semibold transition ${
                    pageIndex === i
                      ? 'bg-[#d71789] text-white shadow-xs'
                      : 'border border-[#e6e1e9] bg-white text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 gap-1 rounded-lg border-[#e6e1e9] text-xs font-medium hover:bg-[#fce8f2] hover:text-[#d71789] disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
