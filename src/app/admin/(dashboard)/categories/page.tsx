import Link from 'next/link'
import { FolderKanban, Plus, Sparkles } from 'lucide-react'
import { listCategories } from '@/actions/categories'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function CategoriesPage() {
  const categories = await listCategories()

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Content taxonomy</p>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Categories</h1>
          <p className="mt-3 text-sm text-[#887f8e]">Organize your stories into clear destinations for your readers.</p>
        </div>
        <Button
          render={<Link href="/admin/categories/new" />}
          className="h-11 rounded-xl bg-gradient-to-r from-[#d71789] to-[#ff7294] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0"
        >
          <Plus className="h-4 w-4" />
          New category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#6b43bb]">
              <FolderKanban className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a49aa9]">Library</span>
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{categories.length}</p>
          <p className="mt-1 text-xs text-[#857c8b]">Active categories</p>
        </div>
        <div className="rounded-2xl border border-[#ebe6ee] bg-[linear-gradient(115deg,#241235,#4c194e)] p-5 text-white shadow-[0_8px_20px_rgba(36,18,53,0.12)]">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#ff9ab2]">
              <Sparkles className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Publishing system</span>
          </div>
          <p className="mt-5 text-sm font-semibold">Keep discovery effortless.</p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-white/55">
            Use focused categories to help travellers find the stories most relevant to them.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-4.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
        <DataTable
          title="Category library"
          description="Manage the topics attached to your posts."
          searchColumnId="name"
          searchPlaceholder="Search categories..."
          headerActions={
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d71789]" />
              {categories.length} categories
            </span>
          }
          columns={columns}
          data={categories}
        />
      </section>
    </div>
  )
}
