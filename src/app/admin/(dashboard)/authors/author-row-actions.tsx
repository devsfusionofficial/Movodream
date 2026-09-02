'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, Pencil, Trash2, User, Mail, Calendar, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteAuthor } from '@/actions/authors'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { formatAdminDate } from '@/lib/date-format'

export function AuthorRowActions({
  id,
  author,
}: {
  id: string
  author?: {
    name?: string
    email?: string
    bio?: string
    createdAt?: string
    avatar?: { url?: string; key?: string } | string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAuthor(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Author deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const name = author?.name || 'Editorial Author'
  const email = author?.email || 'N/A'
  const rawAvatar = author?.avatar
  const authorAvatarUrl = typeof rawAvatar === 'string'
    ? rawAvatar.trim() || null
    : rawAvatar?.url?.trim() || null
  const initial = (name || 'A').trim().charAt(0).toUpperCase()

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View author profile"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/authors/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit author profile"
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
        itemName={name}
        itemType="Author Profile"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {authorAvatarUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[#ebe6ee] bg-[#faf8fb] shadow-sm">
                    <Image
                      src={authorAvatarUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fce8f2] text-lg font-bold text-[#d71789]">
                    {initial}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                    {name}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 flex items-center gap-1 text-xs text-[#857c8b] min-w-0 truncate">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                    Editorial Contributor
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs min-w-0">
            <div className="rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3 min-w-0 overflow-hidden">
              <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Email Address</span>
              <span className="font-medium text-[#21182a] flex items-center gap-1.5 min-w-0 break-all [overflow-wrap:anywhere]">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                <span className="break-all">{email}</span>
              </span>
            </div>

            {author?.bio && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3 leading-relaxed text-[#382b40] whitespace-pre-wrap break-words [overflow-wrap:anywhere] min-w-0">
                <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Biography</span>
                {author.bio}
              </div>
            )}

            {author?.createdAt && (
              <div className="rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3 min-w-0 overflow-hidden">
                <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Author Since</span>
                <span className="font-medium text-[#21182a] flex items-center gap-1.5 min-w-0">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                  <span>{formatAdminDate(author.createdAt)}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/authors/${id}/edit`} />}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
