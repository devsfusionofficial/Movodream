'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { SubscriberRowActions } from './subscriber-row-actions'

export type SubscriberRow = {
  _id: string
  email: string
  status: 'active' | 'unsubscribed'
  subscribedAt?: string
  createdAt?: string
}

export const columns: ColumnDef<SubscriberRow, unknown>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const d = row.original.createdAt || row.original.subscribedAt
      return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <SubscriberRowActions id={row.original._id} subscriber={row.original} />,
  },
]
