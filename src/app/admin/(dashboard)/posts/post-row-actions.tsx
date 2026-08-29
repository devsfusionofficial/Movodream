'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Trash2, Calendar, User, Tag, FileText, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deletePost } from '@/actions/posts'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function PostRowActions({
  id,
  post,
}: {
  id: string
  post?: {
    title?: string
    slug?: string
    excerpt?: string
    contentHtml?: string
    status?: string
    heroImage?: { url?: string }
    author?: { name?: string }
    categories?: { name: string }[]
    tags?: { name: string }[]
    seo?: { title?: string; description?: string; ogImage?: { url?: string } }
    createdAt?: string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePost(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Post deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const authorName = (post?.author as unknown as { name?: string })?.name ?? 'Editorial Team'
  const categoryList = (post?.categories as unknown as { name: string }[])?.map((c) => c.name).join(', ') || 'General'
  const tagList = (post?.tags as unknown as { name: string }[])?.map((t) => t.name) || []
  const heroUrl = post?.heroImage?.url || (post as unknown as { heroImageUrl?: string })?.heroImageUrl
  const title = post?.title || 'Untitled Post'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View post details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/posts/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit post"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          disabled={isPending}
          className="gap-1 text-[#b42318] hover:bg-[#fff1f0] hover:text-[#b42318]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        itemName={title}
        itemType="Post"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-2xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#857c8b] min-w-0">
                  <span className="flex items-center gap-1 font-medium text-[#21182a] truncate max-w-full">
                    <User className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                    {authorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                    {formattedDate}
                  </span>
                  {post?.slug && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[#857c8b] break-all">/{post.slug}</span>
                    </>
                  )}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#d71789] border border-[#f7d4e5] shrink-0">
                {post?.status || 'Draft'}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-3 min-w-0">
            {heroUrl && (
              <div className="overflow-hidden rounded-xl border border-[#ebe6ee] shadow-sm max-h-80 bg-[#f9f8fa]">
                <img
                  src={heroUrl}
                  alt={title}
                  className="w-full object-cover max-h-80"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-xs min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#f7d4e5] bg-[#fce8f2] px-3 py-1 font-semibold text-[#d71789] break-words [overflow-wrap:anywhere]">
                <Tag className="h-3.5 w-3.5 shrink-0" />
                Category: {categoryList}
              </span>
              {tagList.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-lg border border-[#ebe6ee] bg-[#faf8fb] px-2.5 py-1 font-medium text-[#382b40] break-words">
                  #{t}
                </span>
              ))}
            </div>

            {post?.excerpt && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-sm leading-relaxed text-[#382b40] break-words [overflow-wrap:anywhere] min-w-0">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#857c8b]">Article Excerpt</p>
                {post.excerpt}
              </div>
            )}

            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#857c8b] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                Full Article Content
              </p>
              <div className="rounded-xl border border-[#ebe6ee] bg-white p-5 text-sm leading-relaxed text-[#2b2032] shadow-inner break-words [overflow-wrap:anywhere] min-w-0 overflow-x-auto">
                {post?.contentHtml ? (
                  <div
                    className="prose prose-pink max-w-none text-sm text-[#2b2032] [&_img]:my-4 [&_img]:max-h-96 [&_img]:w-full [&_img]:rounded-xl [&_img]:object-cover [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-[#d71789] [&_blockquote]:bg-[#fcf9fc] [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p]:leading-relaxed break-words [overflow-wrap:anywhere]"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                  />
                ) : (
                  <p className="text-sm text-[#857c8b] italic">No HTML content body text available.</p>
                )}
              </div>
            </div>

            {(post?.seo?.title || post?.seo?.description) && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs space-y-1.5 break-words [overflow-wrap:anywhere] min-w-0">
                <p className="font-bold uppercase tracking-wider text-[#857c8b] flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                  SEO Search Metadata
                </p>
                {post.seo.title && <p className="font-semibold text-[#21182a] break-words [overflow-wrap:anywhere]">SEO Title: {post.seo.title}</p>}
                {post.seo.description && <p className="text-[#687075] break-words [overflow-wrap:anywhere]">SEO Description: {post.seo.description}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/posts/${id}/edit`} />}
              className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white shadow-[0_6px_18px_rgba(215,23,137,0.25)] hover:opacity-95 border-0"
            >
              <Pencil className="h-4 w-4" />
              Edit Full Article
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
