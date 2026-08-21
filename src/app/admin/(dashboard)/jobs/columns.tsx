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
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'location', header: 'Location' },
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
