'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { TagRowActions } from './tag-row-actions'
import type { listTags } from '@/actions/tags'

export type TagRow = Awaited<ReturnType<typeof listTags>>[number]

export const columns: ColumnDef<TagRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Slug' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <TagRowActions id={row.original._id} />,
  },
]
