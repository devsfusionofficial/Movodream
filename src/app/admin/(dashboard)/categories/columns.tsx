'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { CategoryRowActions } from './category-row-actions'
import type { listCategories } from '@/actions/categories'

export type CategoryRow = Awaited<ReturnType<typeof listCategories>>[number]

export const columns: ColumnDef<CategoryRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate block font-medium text-[#21182a]" title={row.original.name}>
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate block font-mono text-xs text-[#524458]" title={row.original.slug}>
        {row.original.slug}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <CategoryRowActions id={row.original._id} category={row.original} />,
  },
]
