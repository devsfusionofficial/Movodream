'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Trash2, Building2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deletePartner } from '@/actions/partners'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function PartnerRowActions({
  id,
  partner,
}: {
  id: string
  partner?: {
    name?: string
    category?: string
    websiteUrl?: string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePartner(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Partner deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const name = partner?.name || 'Partner Profile'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View partner details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/partners/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit partner"
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
        itemType="Partner"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-2xl">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a]">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-[#857c8b]">
                  {partner?.category || 'General Partner'}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] p-2 text-[#d71789]">
                <Building2 className="h-5 w-5" />
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs">
            {partner?.websiteUrl && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3">
                <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Website URL</span>
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#d71789] hover:underline flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {partner.websiteUrl}
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/partners/${id}/edit`} />}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Partner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
