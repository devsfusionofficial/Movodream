'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { UserRowActions } from './user-row-actions'
import type { listUsers } from '@/actions/users'

export type UserRow = Awaited<ReturnType<typeof listUsers>>[number]

export const columns: ColumnDef<UserRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="max-w-[180px] truncate block font-medium text-[#21182a]" title={row.original.name?.trim()}>
        {row.original.name?.trim() || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="max-w-[220px] truncate block text-xs text-[#524458]" title={row.original.email}>
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: 'role',
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => {
      const isProtected = row.original.email?.toLowerCase() === 'harman.singh@movodream.com'
      return (
        <div className="flex justify-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[#fce8f2] px-2.5 py-1 text-xs font-semibold capitalize text-[#d71789] leading-none text-center">
            {isProtected ? 'Super Admin' : row.original.role}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <UserRowActions userId={row.original.id} user={row.original} />,
  },
]
