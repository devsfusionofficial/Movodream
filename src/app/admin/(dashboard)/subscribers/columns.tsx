'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { SubscriberRowActions } from './subscriber-row-actions'
import { formatAdminDate } from '@/lib/date-format'

export type SubscriberRow = {
  _id: string
  email: string
  status: 'active' | 'unsubscribed'
  subscribedAt?: string
  createdAt?: string
}

export const columns: ColumnDef<SubscriberRow, unknown>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="max-w-[260px] truncate block font-medium text-[#21182a]" title={row.original.email}>
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        row.original.status === 'active' ? 'bg-[#fce8f2] text-[#d71789]' : 'bg-[#f1edf3] text-[#756b7b]'
      }`}>
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Subscribed',
    cell: ({ row }) => (
      <span className="text-xs text-[#524458] font-medium">
        {formatAdminDate(row.original.createdAt || row.original.subscribedAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <SubscriberRowActions id={row.original._id} subscriber={row.original} />,
  },
]
