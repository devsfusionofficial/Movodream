'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ContactRowActions } from './contact-row-actions'

export type ContactRow = {
  _id: string
  name: string
  email: string
  phone?: string
  message?: string
  createdAt?: string
}

export const columns: ColumnDef<ContactRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[#524458]">
        {row.original.phone || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'message',
    header: 'Message Preview',
    cell: ({ row }) => (
      <span className="max-w-[240px] truncate block text-xs text-[#716578]" title={row.original.message}>
        {row.original.message || '—'}
      </span>
    ),
  },
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
        phone={row.original.phone}
        message={row.original.message}
        createdAt={row.original.createdAt}
      />
    ),
  },
]
