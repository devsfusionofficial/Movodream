'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Trash2, Building2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteOffice } from '@/actions/offices'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function OfficeRowActions({
  id,
  office,
}: {
  id: string
  office?: {
    name?: string
    city?: string
    country?: string
    address?: string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOffice(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Office deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const name = office?.name || 'Office Location'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View office details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/offices/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit office"
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
        itemType="Office Location"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-[#857c8b] min-w-0 truncate">
                  {office?.city ? `${office.city}, ${office.country || ''}` : 'Global Location'}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] p-2 text-[#d71789] shrink-0">
                <Building2 className="h-5 w-5" />
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs min-w-0">
            {office?.address && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3 min-w-0">
                <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Address</span>
                <p className="font-medium text-[#21182a] flex items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                  <span>{office.address}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/offices/${id}/edit`} />}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Office
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
