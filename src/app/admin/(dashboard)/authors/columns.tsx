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
    cell: ({ row }) => <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fce8f2] text-[#d71789]"><UserRound className="h-4 w-4" /></span><div><p className="font-semibold text-[#33283a]">{row.original.name}</p><p className="mt-0.5 text-[11px] text-[#a39aa7]">Movodream contributor</p></div></div>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <AuthorRowActions id={row.original._id} />,
  },
]
