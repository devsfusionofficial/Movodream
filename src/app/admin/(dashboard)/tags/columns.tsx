'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { TagRowActions } from './tag-row-actions'
import type { listTags } from '@/actions/tags'

export type TagRow = Awaited<ReturnType<typeof listTags>>[number]

export const columns: ColumnDef<TagRow, unknown>[] = [
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
    cell: ({ row }) => <TagRowActions id={row.original._id} tag={row.original} />,
  },
]
