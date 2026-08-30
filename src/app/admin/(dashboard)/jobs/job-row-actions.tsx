'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Trash2, Briefcase, MapPin, Building2, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteJob } from '@/actions/jobs'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { formatAdminDate } from '@/lib/date-format'
import { Calendar } from 'lucide-react'

export function JobRowActions({
  id,
  job,
}: {
  id: string
  job?: {
    title?: string
    department?: string
    location?: string
    type?: string
    status?: string
    experience?: string
    qualification?: string
    skills?: string[]
    descriptionHtml?: string
    responsibilitiesHtml?: string
    applicationDeadline?: string | Date
    createdAt?: string | Date
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJob(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Job listing deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const title = job?.title || 'Untitled Job Position'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View job details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/jobs/${id}/edit`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit job listing"
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
        itemType="Job Listing"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-2xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#857c8b] min-w-0">
                  {job?.department && (
                    <span className="flex items-center gap-1 font-medium text-[#21182a] truncate max-w-full">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                      {job.department}
                    </span>
                  )}
                  {job?.location && (
                    <span className="flex items-center gap-1 truncate max-w-full">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                      {job.location}
                    </span>
                  )}
                  {job?.type && (
                    <span className="flex items-center gap-1 font-semibold text-[#b40d6d] shrink-0">
                      <Briefcase className="h-3.5 w-3.5 shrink-0" />
                      {job.type}
                    </span>
                  )}
                  {job?.applicationDeadline && (
                    <span className="flex items-center gap-1 text-[#524458] font-medium shrink-0">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                      Deadline: {formatAdminDate(job.applicationDeadline)}
                    </span>
                  )}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#d71789] border border-[#f7d4e5] shrink-0">
                {job?.status || 'Active'}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs min-w-0">
            {job?.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 min-w-0">
                {job.skills.map((s) => (
                  <span key={s} className="rounded-lg bg-[#f0eaff] px-2.5 py-1 font-medium text-[#6b43bb] border border-[#e2d5ff] break-words">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {job?.descriptionHtml && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs leading-relaxed text-[#382b40] break-words [overflow-wrap:anywhere] min-w-0 overflow-x-auto">
                <p className="mb-1 font-bold uppercase tracking-wider text-[#857c8b]">Job Overview</p>
                <div className="admin-prose text-xs text-[#382b40]" dangerouslySetInnerHTML={{ __html: job.descriptionHtml }} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              render={<Link href={`/admin/jobs/${id}/edit`} />}
              className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white shadow-sm border-0"
            >
              <Pencil className="h-4 w-4" />
              Edit Job Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
