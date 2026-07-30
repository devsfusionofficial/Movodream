import Link from 'next/link'
import { listPosts } from '@/actions/posts'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

const STATUS_TABS = [
  { value: undefined, label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
] as const

type PageProps = { searchParams: Promise<{ status?: string }> }

export default async function PostsPage({ searchParams }: PageProps) {
  const { status } = await searchParams
  const allPosts = await listPosts()
  const posts = status ? allPosts.filter((post) => post.status === status) : allPosts

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Posts</h1>
        <Button render={<Link href="/admin/posts/new" />}>New post</Button>
      </div>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/posts?status=${tab.value}` : '/admin/posts'}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              status === tab.value ? 'border-foreground bg-foreground text-background' : 'border-input text-foreground/70'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <DataTable columns={columns} data={posts} searchColumnId="title" searchPlaceholder="Search posts…" />
    </div>
  )
}
