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
  { accessorKey: 'title', header: 'Title' },
  {
    id: 'author',
    header: 'Author',
    cell: ({ row }) => {
      const author = row.original.author as unknown as { name?: string } | null
      return author?.name ?? '—'
    },
  },
  {
    id: 'categories',
    header: 'Categories',
    cell: ({ row }) => {
      const categories = row.original.categories as unknown as { name: string }[]
      return categories?.map((c) => c.name).join(', ') || '—'
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
