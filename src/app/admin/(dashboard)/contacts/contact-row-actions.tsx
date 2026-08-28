'use client'

import { useState, useTransition } from 'react'
import { Copy, Check, Eye, Mail, Phone, MessageSquare, Trash2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteContactSubmission } from '@/actions/contacts'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function ContactRowActions({
  id,
  name,
  email,
  phone,
  message,
  createdAt,
}: {
  id: string
  name?: string
  email?: string
  phone?: string
  message?: string
  createdAt?: string
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteContactSubmission(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Enquiry deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  function handleCopyEmail() {
    if (email) {
      navigator.clipboard.writeText(email)
      setCopiedEmail(true)
      toast.success('Email copied to clipboard')
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  function handleCopyPhone() {
    if (phone) {
      navigator.clipboard.writeText(phone)
      setCopiedPhone(true)
      toast.success('Phone copied to clipboard')
      setTimeout(() => setCopiedPhone(false), 2000)
    }
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const initial = (name || email || 'C').slice(0, 1).toUpperCase()
  const titleName = name || email || 'Contact Enquiry'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View enquiry details"
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
        itemName={titleName}
        itemType="Enquiry Submission"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-2xl sm:max-w-xl">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fce8f2] text-base font-bold text-[#d71789]">
                  {initial}
                </span>
                <div>
                  <DialogTitle className="text-lg font-bold tracking-tight text-[#21182a]">
                    {name || 'Contact Enquiry'}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#857c8b] flex items-center gap-1.5 mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-[#d71789]" />
                    Received {formattedDate}
                  </DialogDescription>
                </div>
              </div>
              <span className="rounded-full bg-[#fce8f2] px-3 py-1 text-[11px] font-semibold text-[#d71789] border border-[#f7d4e5]">
                Contact Enquiry
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-[#f0edf1] bg-[#faf8fb] px-3.5 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 shrink-0 text-[#d71789]" />
                  <span className="truncate text-xs font-medium text-[#21182a]">{email || 'No email'}</span>
                </div>
                {email && (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d71789] hover:underline cursor-pointer shrink-0 ml-1.5"
                  >
                    {copiedEmail ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copiedEmail ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#f0edf1] bg-[#faf8fb] px-3.5 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-4 w-4 shrink-0 text-[#d71789]" />
                  <span className="truncate text-xs font-medium text-[#21182a] font-mono">{phone || 'No phone'}</span>
                </div>
                {phone && (
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d71789] hover:underline cursor-pointer shrink-0 ml-1.5"
                  >
                    {copiedPhone ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copiedPhone ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#857c8b] flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#d71789]" />
                Message Content
              </p>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-[#ebe6ee] bg-[#ffffff] p-4 text-sm leading-relaxed text-[#2b2032] shadow-inner whitespace-pre-wrap">
                {message || 'No message text provided in this contact enquiry.'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewOpen(false)}
              className="border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
            >
              Close
            </Button>
            {email && (
              <Button
                render={<a href={`mailto:${email}?subject=Re: Movodream Enquiry`} />}
                size="sm"
                className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white shadow-[0_6px_18px_rgba(215,23,137,0.25)] hover:opacity-95 border-0"
              >
                <Mail className="h-4 w-4" />
                Reply via Email
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
