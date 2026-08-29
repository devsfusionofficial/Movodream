'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Trash2, FolderKanban, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteCategory } from '@/actions/categories'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function CategoryRowActions({
  id,
  category,
}: {
  id: string
  category?: {
    name?: string
    slug?: string
    description?: string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Category deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const name = category?.name || 'Untitled Category'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View category details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/categories/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit category"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        itemName={name}
        itemType="Category"
      />

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 font-mono text-xs text-[#857c8b] min-w-0 break-all [overflow-wrap:anywhere]">
                  /{category?.slug || 'category-slug'}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] p-2 text-[#d71789] shrink-0">
                <FolderKanban className="h-5 w-5" />
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3 min-w-0">
            <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs leading-relaxed text-[#382b40] whitespace-pre-wrap break-words [overflow-wrap:anywhere] min-w-0">
              <p className="mb-1 font-bold uppercase tracking-wider text-[#857c8b]">Description</p>
              {category?.description || 'No description provided for this category.'}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/categories/${id}/edit`} />}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
