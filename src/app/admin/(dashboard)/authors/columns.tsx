'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { AuthorRowActions } from './author-row-actions'
import type { listAuthors } from '@/actions/authors'
import { UserRound } from 'lucide-react'

export type AuthorRow = Awaited<ReturnType<typeof listAuthors>>[number]

export const columns: ColumnDef<AuthorRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Author',
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fce8f2] text-[#d71789]">
          <UserRound className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[#33283a] truncate max-w-[200px]" title={row.original.name}>{row.original.name}</p>
          <p className="mt-0.5 text-[11px] text-[#a39aa7] truncate max-w-[240px]" title={row.original.email || undefined}>{row.original.email || 'Movodream contributor'}</p>
        </div>
      </div>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <AuthorRowActions id={row.original._id} author={row.original} />,
  },
]
