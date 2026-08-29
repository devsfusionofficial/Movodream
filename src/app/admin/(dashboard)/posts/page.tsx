import Link from 'next/link'
import { ArrowUpRight, FileText, Plus, Send, SlidersHorizontal } from 'lucide-react'
import { listPosts } from '@/actions/posts'
import { requirePagePermission } from '@/lib/auth-guard'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

const STATUS_TABS = [
  { value: undefined, label: 'All posts' },
  { value: 'draft', label: 'Drafts' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
] as const

type PageProps = { searchParams: Promise<{ status?: string }> }

export default async function PostsPage({ searchParams }: PageProps) {
  await requirePagePermission('posts', ['read'])
  const { status } = await searchParams
  const allPosts = await listPosts()
  const posts = status ? allPosts.filter((post) => post.status === status) : allPosts
  const published = allPosts.filter((post) => post.status === 'published').length
  const drafts = allPosts.filter((post) => post.status === 'draft').length
  const scheduled = allPosts.filter((post) => post.status === 'scheduled').length

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Content library</p>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Posts</h1>
          <p className="mt-3 text-sm text-[#887f8e]">Create, refine, and publish stories for the Movodream community.</p>
        </div>
        <Button
          render={<Link href="/admin/posts/new" />}
          className="h-11 rounded-xl bg-gradient-to-r from-[#d71789] to-[#ff7294] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0"
        >
          <Plus className="h-4 w-4" />
          New post
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/posts?status=published"
          className="group rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
              <Send className="h-[17px] w-[17px]" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#c6bdc9] transition group-hover:text-[#d71789]" />
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{published}</p>
          <p className="mt-1 text-xs text-[#857c8b]">Published posts</p>
        </Link>
        <Link
          href="/admin/posts?status=draft"
          className="group rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3df] text-[#b46b10]">
              <FileText className="h-[17px] w-[17px]" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#c6bdc9] transition group-hover:text-[#d71789]" />
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{drafts}</p>
          <p className="mt-1 text-xs text-[#857c8b]">Drafts in progress</p>
        </Link>
        <Link
          href="/admin/posts?status=scheduled"
          className="group rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#6b43bb]">
              <SlidersHorizontal className="h-[17px] w-[17px]" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#c6bdc9] transition group-hover:text-[#d71789]" />
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{scheduled}</p>
          <p className="mt-1 text-xs text-[#857c8b]">Scheduled to publish</p>
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-4.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
        <DataTable
          title="All content"
          description={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'} matching your current view`}
          searchColumnId="title"
          searchPlaceholder="Search by post title..."
          headerActions={
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.value ? `/admin/posts?status=${tab.value}` : '/admin/posts'}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    status === tab.value
                      ? 'border-[#241235] bg-[#241235] text-white'
                      : 'border-[#e8e1ea] text-[#827687] hover:border-[#d7b0c6] hover:text-[#b40d6d]'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          }
          columns={columns}
          data={posts}
        />
      </section>
    </div>
  )
}
