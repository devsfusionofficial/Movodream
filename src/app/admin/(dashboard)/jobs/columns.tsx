'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { JobRowActions } from './job-row-actions'
import type { listJobs } from '@/actions/jobs'

export type JobRow = Awaited<ReturnType<typeof listJobs>>[number]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  published: 'default',
  draft: 'outline',
  disabled: 'secondary',
  closed: 'destructive',
}

export const columns: ColumnDef<JobRow, unknown>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <span className="max-w-[240px] truncate block font-medium text-[#21182a]" title={row.original.title}>
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <span className="max-w-[140px] truncate block text-xs text-[#524458]" title={row.original.department}>
        {row.original.department}
      </span>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <span className="max-w-[140px] truncate block text-xs text-[#524458]" title={row.original.location}>
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status] ?? 'outline'}>{row.original.status}</Badge>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <JobRowActions id={row.original._id} job={row.original} />,
  },
]
