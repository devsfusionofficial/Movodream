import { notFound } from 'next/navigation'
import { getApplication } from '@/actions/applications'
import { ApplicationStatusForm } from '../application-status-form'
import { ResumeDownloadButton } from '../resume-download-button'
import { formatAdminDate } from '@/lib/date-format'

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const application = await getApplication(id)
  if (!application) notFound()

  const job = application.job as unknown as { title?: string } | null

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{application.name}</h1>
        <p className="text-sm text-muted-foreground">Applied for {job?.title ?? 'Unknown role'}</p>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{application.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Phone</dt>
          <dd>{application.phone}</dd>
        </div>
        {application.location && (
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd>{application.location}</dd>
          </div>
        )}
        {application.experience && (
          <div>
            <dt className="text-muted-foreground">Experience</dt>
            <dd>{application.experience}</dd>
          </div>
        )}
        {application.qualification && (
          <div>
            <dt className="text-muted-foreground">Qualification</dt>
            <dd>{application.qualification}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted-foreground">Applied on</dt>
          <dd>{formatAdminDate(application.appliedAt ?? application.createdAt)}</dd>
        </div>
      </dl>

      {application.coverLetter && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground">Cover letter</h2>
          <p className="mt-1 whitespace-pre-wrap text-sm">{application.coverLetter}</p>
        </div>
      )}

      <ResumeDownloadButton applicationId={id} />

      <ApplicationStatusForm applicationId={id} status={application.status} internalNotes={application.internalNotes} />
    </div>
  )
}
