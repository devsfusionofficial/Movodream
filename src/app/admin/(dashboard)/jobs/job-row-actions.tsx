'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Eye,
  Pencil,
  Trash2,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  GraduationCap,
  Clock,
  ExternalLink,
  Sparkles,
  FileText,
  ListChecks,
} from 'lucide-react'
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

export function JobRowActions({
  id,
  job,
}: {
  id: string
  job?: {
    title?: string
    slug?: string
    department?: string
    location?: string
    employmentType?: string
    type?: string
    status?: string
    experience?: string
    qualification?: string
    skills?: string[]
    shortDescription?: string
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
  const empType = job?.employmentType || job?.type || 'Full-time'
  const statusColor =
    job?.status === 'published'
      ? 'bg-[#ecfdf3] text-[#027a48] border-[#a6f4c5]'
      : job?.status === 'closed'
        ? 'bg-[#fef3f2] text-[#b42318] border-[#fecdca]'
        : job?.status === 'disabled'
          ? 'bg-[#f8f9fa] text-[#555] border-[#e9ecef]'
          : 'bg-[#fce8f2] text-[#d71789] border-[#f7d4e5]'

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
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-7 shadow-2xl min-w-0">
          {/* Header */}
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-8 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-2xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#857c8b] min-w-0">
                  {job?.department && (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#21182a] truncate max-w-full">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                      {job.department}
                    </span>
                  )}
                  {job?.location && (
                    <span className="inline-flex items-center gap-1 font-medium text-[#524458] truncate max-w-full">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                      {job.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 font-semibold text-[#b40d6d] shrink-0">
                    <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#b40d6d]" />
                    {empType}
                  </span>
                  {job?.applicationDeadline && (
                    <span className="inline-flex items-center gap-1 font-medium text-[#524458] shrink-0">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                      Deadline: {formatAdminDate(job.applicationDeadline)}
                    </span>
                  )}
                </DialogDescription>
              </div>
              <span className={`rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider border shrink-0 ${statusColor}`}>
                {job?.status || 'Draft'}
              </span>
            </div>
          </DialogHeader>

          {/* Modal Body */}
          <div className="space-y-5 py-4 text-xs min-w-0">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#f0ebf2] bg-[#fdfbfd] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#857c8b]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Qualification</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#21182a] truncate" title={job?.qualification || 'Not specified'}>
                  {job?.qualification || 'Not specified'}
                </p>
              </div>

              <div className="rounded-xl border border-[#f0ebf2] bg-[#fdfbfd] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#857c8b]">
                  <Clock className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Experience</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#21182a] truncate" title={job?.experience || 'Not specified'}>
                  {job?.experience || 'Not specified'}
                </p>
              </div>

              <div className="rounded-xl border border-[#f0ebf2] bg-[#fdfbfd] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#857c8b]">
                  <Briefcase className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Job Type</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#21182a] truncate">
                  {empType}
                </p>
              </div>

              <div className="rounded-xl border border-[#f0ebf2] bg-[#fdfbfd] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#857c8b]">
                  <MapPin className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Location</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#21182a] truncate" title={job?.location || 'Not specified'}>
                  {job?.location || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#857c8b]">
                <Sparkles className="h-3.5 w-3.5 text-[#d71789]" />
                <span>Skills & Tech Stack</span>
              </div>
              {job?.skills && job.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-[#f0eaff] px-2.5 py-1 text-xs font-medium text-[#6b43bb] border border-[#e2d5ff] break-words"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#857c8b] italic">No specific skills listed for this position.</p>
              )}
            </div>

            {/* Short Description */}
            {job?.shortDescription && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs min-w-0">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#857c8b]">
                  <Sparkles className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Short Summary (Teaser)</span>
                </div>
                <p className="text-xs leading-relaxed text-[#382b40]">{job.shortDescription}</p>
              </div>
            )}

            {/* Description */}
            <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs min-w-0">
              <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#857c8b]">
                <FileText className="h-3.5 w-3.5 text-[#d71789]" />
                <span>Job Overview & Description</span>
              </div>
              {job?.descriptionHtml && job.descriptionHtml.trim().length > 0 ? (
                <div
                  className="admin-prose max-h-[280px] overflow-y-auto text-xs leading-relaxed text-[#382b40] pr-2"
                  dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                />
              ) : (
                <p className="text-xs text-[#857c8b] italic">No description provided for this job.</p>
              )}
            </div>

            {/* Responsibilities */}
            {job?.responsibilitiesHtml && job.responsibilitiesHtml.trim().length > 0 && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 text-xs min-w-0">
                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#857c8b]">
                  <ListChecks className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Key Responsibilities</span>
                </div>
                <div
                  className="admin-prose max-h-[240px] overflow-y-auto text-xs leading-relaxed text-[#382b40] pr-2"
                  dangerouslySetInnerHTML={{ __html: job.responsibilitiesHtml }}
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <div className="flex items-center gap-2">
              {job?.slug && (
                <a
                  href={`/careers/${job.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#e6e1e9] bg-white px-3 py-1.5 text-xs font-semibold text-[#524458] transition hover:border-[#d71789] hover:text-[#d71789]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on website
                </a>
              )}
              <Button
                render={<Link href={`/admin/jobs/${id}/edit`} />}
                className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white shadow-sm border-0"
              >
                <Pencil className="h-4 w-4" />
                Edit Job Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
