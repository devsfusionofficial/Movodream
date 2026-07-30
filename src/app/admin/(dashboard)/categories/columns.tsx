'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { CategoryRowActions } from './category-row-actions'
import type { listCategories } from '@/actions/categories'

export type CategoryRow = Awaited<ReturnType<typeof listCategories>>[number]

export const columns: ColumnDef<CategoryRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Slug' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <CategoryRowActions id={row.original._id} />,
  },
]
