import { notFound } from 'next/navigation'
import { getJob } from '@/actions/jobs'
import { JobForm } from '../../job-form'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJob(id)
  if (!job) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit job</h1>
      <JobForm
        jobId={id}
        defaultValues={{
          title: job.title,
          slug: job.slug,
          department: job.department,
          location: job.location,
          employmentType: job.employmentType,
          experience: job.experience,
          qualification: job.qualification,
          skills: job.skills ?? [],
          descriptionJson: job.descriptionJson,
          descriptionHtml: job.descriptionHtml,
          responsibilitiesJson: job.responsibilitiesJson,
          responsibilitiesHtml: job.responsibilitiesHtml,
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline).toISOString().slice(0, 10)
            : '',
          status: job.status,
        }}
      />
    </div>
  )
}
