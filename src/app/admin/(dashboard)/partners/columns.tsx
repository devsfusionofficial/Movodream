'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { PartnerRowActions } from './partner-row-actions'
import type { listPartners } from '@/actions/partners'

export type PartnerRow = Awaited<ReturnType<typeof listPartners>>[number]

export const columns: ColumnDef<PartnerRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <PartnerRowActions id={row.original._id} partner={row.original} />,
  },
]
