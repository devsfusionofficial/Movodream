'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Trash2, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteTag } from '@/actions/tags'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function TagRowActions({
  id,
  tag,
}: {
  id: string
  tag?: {
    name?: string
    slug?: string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTag(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Tag deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const name = tag?.name || 'Untitled Tag'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View tag details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/tags/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit tag"
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
        itemName={`#${name}`}
        itemType="Tag"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-2xl">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a]">
                  #{name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 font-mono text-xs text-[#857c8b]">
                  /{tag?.slug || 'tag-slug'}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] p-2 text-[#d71789]">
                <Hash className="h-5 w-5" />
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs leading-relaxed text-[#382b40]">
              <p className="mb-1 font-bold uppercase tracking-wider text-[#857c8b]">Tag Information</p>
              Tag label: <strong className="text-[#21182a]">#{name}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/tags/${id}/edit`} />}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Tag
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
