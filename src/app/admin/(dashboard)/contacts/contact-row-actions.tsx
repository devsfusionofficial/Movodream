'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Copy, Check, Eye, Mail, Phone, MessageSquare, Trash2, Calendar, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteContactSubmission } from '@/actions/contacts'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { formatAdminDate } from '@/lib/date-format'

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
  const [expandedName, setExpandedName] = useState(false)

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


  function handleReplyDefault() {
    if (!email) return
    const subject = encodeURIComponent(`Re: Movodream Enquiry${name ? ` - ${name}` : ''}`)
    toast.success('Opening default mail client...')
    window.location.href = `mailto:${email}?subject=${subject}`
  }

  const formattedDate = formatAdminDate(createdAt, true)

  const initial = (name?.trim() || email?.trim() || 'C').slice(0, 1).toUpperCase()
  const titleName = name?.trim() || email?.trim() || 'Contact Enquiry'

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
        {email && (
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/admin/contacts/${id}/reply`} />}
            className="gap-1 border-[#f7d4e5] bg-[#fdf5f9] text-[#d71789] hover:bg-[#fce8f2] hover:border-[#d71789] font-medium"
            title="Compose email reply with live preview"
          >
            <Mail className="h-3.5 w-3.5" />
            Reply
          </Button>
        )}
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

      <Dialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open)
          if (!open) setExpandedName(false)
        }}
      >
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0 overflow-hidden">
          {/* Fixed Header */}
          <DialogHeader className="border-b border-[#f0edf1] pb-3.5 pr-8 shrink-0 min-w-0">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-base font-bold text-[#d71789] mt-0.5 select-none">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="rounded-full bg-[#fce8f2] px-2.5 py-0.5 text-[11px] font-semibold text-[#d71789] border border-[#f7d4e5] shrink-0">
                    Contact Enquiry
                  </span>
                  {name && name.length > 35 && (
                    <button
                      type="button"
                      onClick={() => setExpandedName(!expandedName)}
                      className="text-[11px] font-semibold text-[#d71789] hover:underline cursor-pointer select-none shrink-0"
                    >
                      {expandedName ? 'Show less' : 'Show full name'}
                    </button>
                  )}
                </div>
                <DialogTitle
                  className={`text-base sm:text-lg font-bold text-[#21182a] leading-snug break-words [overflow-wrap:anywhere] [word-break:break-word] ${
                    expandedName ? 'max-h-36 overflow-y-auto pr-1' : 'line-clamp-2'
                  }`}
                  title={name || 'Contact Enquiry'}
                >
                  {name || 'Contact Enquiry'}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#857c8b] flex items-center gap-1.5 mt-1 min-w-0 truncate">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                  Received {formattedDate}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 min-h-0 space-y-3.5 py-3.5 text-xs min-w-0 pr-1">
            <div className="grid gap-2.5 sm:grid-cols-2 min-w-0">
              <div className="flex items-center justify-between rounded-xl border border-[#f0edf1] bg-[#faf8fb] px-3.5 py-2.5 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  <Mail className="h-4 w-4 shrink-0 text-[#d71789]" />
                  <span className="truncate block w-full text-xs font-medium text-[#21182a] [overflow-wrap:anywhere]" title={email || 'No email'}>
                    {email || 'No email'}
                  </span>
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

              <div className="flex items-center justify-between rounded-xl border border-[#f0edf1] bg-[#faf8fb] px-3.5 py-2.5 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  <Phone className="h-4 w-4 shrink-0 text-[#d71789]" />
                  <span className="truncate block w-full text-xs font-medium text-[#21182a] font-mono [overflow-wrap:anywhere]" title={phone || 'No phone'}>
                    {phone || 'No phone'}
                  </span>
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

            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#857c8b] flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                Message Content
              </p>
              <div className="rounded-xl border border-[#ebe6ee] bg-[#ffffff] p-4 text-sm leading-relaxed text-[#2b2032] shadow-xs whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word] min-w-0 select-text">
                {message || 'No message text provided in this contact enquiry.'}
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewOpen(false)}
              className="border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
            >
              Close
            </Button>
            {email && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReplyDefault}
                  className="gap-1.5 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
                  title="Open in your default desktop mail client (Outlook, Apple Mail, etc.)"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#857c8b]" />
                  Mail App
                </Button>
                <Button
                  size="sm"
                  render={<Link href={`/admin/contacts/${id}/reply`} />}
                  className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white shadow-[0_6px_18px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 font-medium cursor-pointer"
                  title="Compose and send reply directly from support@movodream.com"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
