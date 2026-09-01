'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { PartnerRowActions } from './partner-row-actions'
import type { listPartners } from '@/actions/partners'

export type PartnerRow = Awaited<ReturnType<typeof listPartners>>[number]

export const columns: ColumnDef<PartnerRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Partner',
    cell: ({ row }) => {
      const logoUrl = row.original.logo?.url
      const url = row.original.url
      return (
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="h-9 w-9 rounded-lg border border-[#ebe6ee] bg-[#faf8fb] p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={logoUrl} alt="" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-lg border border-[#ebe6ee] bg-[#fce8f2] text-[#d71789] flex items-center justify-center shrink-0 text-xs font-bold uppercase">
              {row.original.name?.charAt(0) || 'P'}
            </div>
          )}
          <div className="min-w-0">
            <span className="max-w-[200px] truncate block font-semibold text-[#21182a]" title={row.original.name}>
              {row.original.name}
            </span>
            {url && (
              <span className="text-[11px] text-[#857c8b] truncate block max-w-[200px]">
                {url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className="max-w-[160px] truncate block text-xs text-[#524458]" title={row.original.category}>
        {row.original.category || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-[#857c8b]">
        #{row.original.order ?? 0}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <PartnerRowActions id={row.original._id} partner={row.original} />,
  },
]
