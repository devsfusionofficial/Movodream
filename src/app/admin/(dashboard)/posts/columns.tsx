'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { PostRowActions } from './post-row-actions'
import type { listPosts } from '@/actions/posts'

export type PostRow = Awaited<ReturnType<typeof listPosts>>[number]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  scheduled: 'secondary',
  draft: 'outline',
}

export const columns: ColumnDef<PostRow, unknown>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <span className="max-w-[280px] truncate block font-medium text-[#21182a]" title={row.original.title}>
        {row.original.title || 'Untitled Post'}
      </span>
    ),
  },
  {
    id: 'author',
    header: 'Author',
    cell: ({ row }) => {
      const author = row.original.author as unknown as { name?: string } | null
      return (
        <span className="max-w-[150px] truncate block text-xs text-[#524458]" title={author?.name}>
          {author?.name ?? '—'}
        </span>
      )
    },
  },
  {
    id: 'categories',
    header: 'Categories',
    cell: ({ row }) => {
      const categories = row.original.categories as unknown as { name: string }[]
      const label = categories?.map((c) => c.name).join(', ') || '—'
      return (
        <span className="max-w-[180px] truncate block text-xs text-[#524458]" title={label}>
          {label}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status] ?? 'outline'}>{row.original.status}</Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <PostRowActions id={row.original._id} post={row.original} />,
  },
]
