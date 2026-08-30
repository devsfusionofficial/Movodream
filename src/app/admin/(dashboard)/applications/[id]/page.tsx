import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, UserRound } from 'lucide-react'
import { getApplication } from '@/actions/applications'
import { requirePagePermission } from '@/lib/auth-guard'
import { ApplicationStatusForm } from '../application-status-form'
import { ResumeDownloadButton } from '../resume-download-button'
import { FormattedDate } from '@/components/admin/formatted-date'

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission('applications', ['read'])
  const { id } = await params
  const application = await getApplication(id)
  if (!application) notFound()

  const job = application.job as unknown as { title?: string } | null

  return (
    <div className="admin-resource-page mx-auto max-w-[1280px] w-full space-y-4 pb-6 outline-none min-w-0">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#887f8e] transition-colors hover:text-[#d71789]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to applications
      </Link>

      <header className="flex flex-col gap-3 border-b border-[#eee9f0] pb-4 sm:flex-row sm:items-end sm:justify-between min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d71789]">Candidate Profile</p>
            <h1 className="text-2xl font-semibold tracking-[-0.05em] text-[#21182a] sm:text-3xl break-words [overflow-wrap:anywhere]">{application.name}</h1>
            <p className="mt-1 text-xs text-[#887f8e] truncate">Applied for {job?.title ?? 'Unknown role'}</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-[#eadfe8] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#887f8e] shrink-0">
          Secure candidate file
        </span>
      </header>

      <div className="space-y-6 rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-7 shadow-[0_5px_18px_rgba(34,20,40,0.025)] min-w-0">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm min-w-0">
          <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-3.5 min-w-0">
            <dt className="text-xs font-medium text-[#887f8e]">Email Address</dt>
            <dd className="mt-1 font-semibold text-[#21182a] break-all [overflow-wrap:anywhere]">{application.email}</dd>
          </div>
          <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-3.5 min-w-0">
            <dt className="text-xs font-medium text-[#887f8e]">Phone Number</dt>
            <dd className="mt-1 font-semibold text-[#21182a] break-all">{application.phone || 'Not provided'}</dd>
          </div>
          {application.location && (
            <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-3.5 min-w-0">
              <dt className="text-xs font-medium text-[#887f8e]">Location</dt>
              <dd className="mt-1 font-semibold text-[#21182a] break-words">{application.location}</dd>
            </div>
          )}
          {application.experience && (
            <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-3.5 min-w-0">
              <dt className="text-xs font-medium text-[#887f8e]">Experience</dt>
              <dd className="mt-1 font-semibold text-[#21182a] break-words">{application.experience}</dd>
            </div>
          )}
          {application.qualification && (
            <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-3.5 min-w-0">
              <dt className="text-xs font-medium text-[#887f8e]">Qualification</dt>
              <dd className="mt-1 font-semibold text-[#21182a] break-words">{application.qualification}</dd>
            </div>
          )}
          <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-3.5 min-w-0">
            <dt className="text-xs font-medium text-[#887f8e]">Applied On</dt>
            <dd className="mt-1 font-semibold text-[#21182a]">
              <FormattedDate date={application.appliedAt ?? application.createdAt} includeTime />
            </dd>
          </div>
        </dl>

        {application.coverLetter && (
          <div className="rounded-xl border border-[#f2edf4] bg-[#fdfbfd] p-4 min-w-0">
            <h2 className="text-xs font-semibold text-[#887f8e]">Cover letter / note</h2>
            <p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed text-[#21182a] min-w-0">{application.coverLetter}</p>
          </div>
        )}

        <div className="pt-2">
          <ResumeDownloadButton applicationId={id} />
        </div>

        <div className="border-t border-[#f0edf1] pt-6">
          <ApplicationStatusForm applicationId={id} status={application.status} internalNotes={application.internalNotes} />
        </div>
      </div>
    </div>
  )
}
