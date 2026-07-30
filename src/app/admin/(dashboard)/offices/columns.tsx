'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { OfficeRowActions } from './office-row-actions'
import type { listOffices } from '@/actions/offices'

export type OfficeRow = Awaited<ReturnType<typeof listOffices>>[number]

export const columns: ColumnDef<OfficeRow, unknown>[] = [
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'slug', header: 'Slug' },
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
    cell: ({ row }) => <OfficeRowActions id={row.original._id} />,
  },
]
