'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { UserRowActions } from './user-row-actions'
import type { listUsers } from '@/actions/users'

export type UserRow = Awaited<ReturnType<typeof listUsers>>[number]

export const columns: ColumnDef<UserRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <Badge variant="secondary">{row.original.role ?? 'editor'}</Badge>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <UserRowActions userId={row.original.id} role={row.original.role ?? 'editor'} />,
  },
]
