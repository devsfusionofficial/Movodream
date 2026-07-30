'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { AuthorRowActions } from './author-row-actions'
import type { listAuthors } from '@/actions/authors'

export type AuthorRow = Awaited<ReturnType<typeof listAuthors>>[number]

export const columns: ColumnDef<AuthorRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <AuthorRowActions id={row.original._id} />,
  },
]
