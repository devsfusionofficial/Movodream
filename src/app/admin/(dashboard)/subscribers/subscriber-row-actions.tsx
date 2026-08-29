'use client'

import { useState, useTransition } from 'react'
import { Eye, Mail, Trash2, Calendar, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteSubscriber } from '@/actions/subscribers'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function SubscriberRowActions({
  id,
  subscriber,
}: {
  id: string
  subscriber?: {
    email?: string
    status?: string
    createdAt?: string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSubscriber(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Subscriber deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const email = subscriber?.email || 'N/A'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View subscriber details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
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
        itemName={email}
        itemType="Newsletter Subscriber"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  Subscriber Profile
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-[#857c8b] min-w-0 truncate">
                  Newsletter subscriber record
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] px-3 py-1 text-xs font-semibold capitalize text-[#d71789] border border-[#f7d4e5] shrink-0">
                {subscriber?.status || 'Active'}
              </span>
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
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            {email && (
              <Button
                render={<a href={`mailto:${email}`} />}
                className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Subscriber
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
