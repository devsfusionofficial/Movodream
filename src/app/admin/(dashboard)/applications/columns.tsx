'use client'

import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { listApplications } from '@/actions/applications'

export type ApplicationRow = Awaited<ReturnType<typeof listApplications>>[number]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Applied: 'outline',
  'Under Review': 'secondary',
  Shortlisted: 'secondary',
  'Interview Scheduled': 'secondary',
  Selected: 'default',
  Rejected: 'destructive',
}

export const columns: ColumnDef<ApplicationRow, unknown>[] = [
  { accessorKey: 'name', header: 'Candidate' },
  { accessorKey: 'email', header: 'Email' },
  {
    id: 'job',
    header: 'Role',
    cell: ({ row }) => {
      const job = row.original.job as unknown as { title?: string } | null
      return job?.title ?? '—'
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status] ?? 'outline'}>{row.original.status}</Badge>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/admin/applications/${row.original._id}`} />}
        className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </Button>
    ),
  },
]
