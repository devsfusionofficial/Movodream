'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ContactRowActions } from './contact-row-actions'
import type { listContactSubmissions } from '@/actions/contacts'
import { formatAdminDate } from '@/lib/date-format'

export type ContactRow = Awaited<ReturnType<typeof listContactSubmissions>>[number]

export const columns: ColumnDef<ContactRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a className="text-primary hover:underline" href={`mailto:${row.original.email}`}>
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <a className="text-primary hover:underline" href={`tel:${row.original.phone}`}>
        {row.original.phone}
      </a>
    ),
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-md text-muted-foreground" title={row.original.message ?? ''}>
        {row.original.message || '—'}
      </span>
    ),
  },
  {
    id: 'emailSent',
    header: 'Notified',
    cell: ({ row }) => (
      // Surfaces mail-delivery failures: a submission is still saved when the
      // SMTP notification fails, so without this the team can't tell which
      // enquiries never reached their inbox.
      <Badge variant={row.original.emailSent ? 'default' : 'secondary'}>
        {row.original.emailSent ? 'Sent' : 'Not sent'}
      </Badge>
    ),
  },
  {
    id: 'createdAt',
    header: 'Received',
    cell: ({ row }) => formatAdminDate(row.original.createdAt, true),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <ContactRowActions id={row.original._id} />,
  },
]
