import { listAuthors } from '@/actions/authors'
import { listCategories } from '@/actions/categories'
import { listTags } from '@/actions/tags'
import { PostForm } from '../post-form'
import Link from 'next/link'
import { ArrowLeft, FilePlus2 } from 'lucide-react'

export default async function NewPostPage() {
  const [authors, categories, tags] = await Promise.all([listAuthors(), listCategories(), listTags()])

  return (
    <div className="w-full space-y-7">
      <div className="flex flex-col gap-5 border-b border-[#ebe6ee] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#a18f9f] transition hover:text-[#b40d6d]"><ArrowLeft className="h-3.5 w-3.5" />Back to posts</Link>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]"><FilePlus2 className="h-[18px] w-[18px]" /></span><div><h1 className="text-3xl font-semibold tracking-[-0.055em] text-[#21182a]">Create a new post</h1><p className="mt-1 text-sm text-[#887f8e]">Share a story, idea, or destination with the Movodream community.</p></div></div>
        </div>
        <span className="w-fit rounded-full border border-[#eee5ee] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a18f9f]">Draft mode</span>
      </div>
      <PostForm authors={authors} categories={categories} tags={tags} />
    </div>
  )
}
