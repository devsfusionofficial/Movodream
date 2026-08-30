'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ContactRowActions } from './contact-row-actions'
import { formatAdminDate } from '@/lib/date-format'

export type ContactRow = {
  _id: string
  name: string
  email: string
  phone?: string
  message?: string
  createdAt?: string
}

export const columns: ColumnDef<ContactRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate block font-medium text-[#21182a]" title={row.original.name}>
        {row.original.name || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="max-w-[220px] truncate block text-xs text-[#524458]" title={row.original.email}>
        {row.original.email || '—'}
      </span>
    ),
  },
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
    cell: ({ row }) => (
      <span className="text-xs text-[#524458] font-medium">
        {formatAdminDate(row.original.createdAt)}
      </span>
    ),
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
