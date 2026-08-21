'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ContactRowActions } from './contact-row-actions'

export type ContactRow = {
  _id: string
  name: string
  email: string
  subject?: string
  message?: string
  createdAt?: string
}

export const columns: ColumnDef<ContactRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'subject', header: 'Subject' },
  {
    accessorKey: 'createdAt',
    header: 'Received',
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recently',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <ContactRowActions
        id={row.original._id}
        name={row.original.name}
        email={row.original.email}
        subject={row.original.subject}
        message={row.original.message}
        createdAt={row.original.createdAt}
      />
    ),
  },
]
