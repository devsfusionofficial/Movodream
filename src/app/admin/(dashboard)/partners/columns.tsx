'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { PartnerRowActions } from './partner-row-actions'
import type { listPartners } from '@/actions/partners'

export type PartnerRow = Awaited<ReturnType<typeof listPartners>>[number]

export const columns: ColumnDef<PartnerRow, unknown>[] = [
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className="max-w-[160px] truncate block text-xs text-[#524458]" title={row.original.category}>
        {row.original.category || '—'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <PartnerRowActions id={row.original._id} partner={row.original} />,
  },
]
