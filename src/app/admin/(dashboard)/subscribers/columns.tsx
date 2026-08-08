'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { SubscriberRowActions } from './subscriber-row-actions'
import type { listSubscribers } from '@/actions/subscribers'
import { formatAdminDate } from '@/lib/date-format'

export type SubscriberRow = Awaited<ReturnType<typeof listSubscribers>>[number]

export const columns: ColumnDef<SubscriberRow, unknown>[] = [
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>{row.original.status}</Badge>
    ),
  },
  {
    id: 'subscribedAt',
    header: 'Subscribed',
    cell: ({ row }) => formatAdminDate(row.original.subscribedAt ?? row.original.createdAt),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <SubscriberRowActions id={row.original._id} status={row.original.status} />,
  },
]
