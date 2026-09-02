'use client'

import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { Building2, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { OfficeRowActions } from './office-row-actions'
import type { listOffices } from '@/actions/offices'

export type OfficeRow = Awaited<ReturnType<typeof listOffices>>[number]

export const columns: ColumnDef<OfficeRow, unknown>[] = [
  {
    accessorKey: 'city',
    header: 'Office Hub',
    cell: ({ row }) => {
      const office = row.original
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#ebe6ee] bg-[#fbf9fc] flex items-center justify-center shadow-xs">
            {office.image?.url ? (
              <Image
                src={office.image.url}
                alt={office.city}
                fill
                className="object-cover"
              />
            ) : (
              <Building2 className="h-4 w-4 text-[#d71789]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-sm text-[#21182a]" title={office.city}>
              {office.city}
            </span>
            {office.description ? (
              <span className="block truncate text-xs text-[#857c8b]" title={office.description}>
                {office.description}
              </span>
            ) : office.address ? (
              <span className="block truncate text-xs text-[#857c8b]" title={office.address}>
                {office.address}
              </span>
            ) : null}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <span className="max-w-[140px] truncate block font-mono text-xs text-[#524458]" title={row.original.slug}>
        /{row.original.slug}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'live' ? 'default' : 'secondary'}
        className={
          row.original.status === 'live'
            ? 'bg-[#e7f7ed] text-[#0f7b3d] hover:bg-[#e7f7ed] border-0 text-xs font-semibold'
            : 'bg-[#f4f1f5] text-[#6d6174] hover:bg-[#f4f1f5] border-0 text-xs font-semibold'
        }
      >
        {row.original.status === 'live' ? 'Live HQ' : 'Coming Soon'}
      </Badge>
    ),
  },
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-[#857c8b]">
        #{row.original.order ?? 0}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <OfficeRowActions id={row.original._id} office={row.original} />,
  },
]
