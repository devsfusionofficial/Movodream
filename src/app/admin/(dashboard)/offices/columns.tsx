'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { OfficeRowActions } from './office-row-actions'
import type { listOffices } from '@/actions/offices'

export type OfficeRow = Awaited<ReturnType<typeof listOffices>>[number]

export const columns: ColumnDef<OfficeRow, unknown>[] = [
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate block font-medium text-[#21182a]" title={row.original.city}>
        {row.original.city}
      </span>
    ),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <span className="max-w-[160px] truncate block font-mono text-xs text-[#524458]" title={row.original.slug}>
        {row.original.slug}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'live' ? 'default' : 'secondary'}>
        {row.original.status === 'live' ? 'Live' : 'Coming Soon'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <OfficeRowActions id={row.original._id} office={row.original} />,
  },
]
