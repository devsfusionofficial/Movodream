import { notFound } from 'next/navigation'
import { getJob } from '@/actions/jobs'
import { JobForm } from '../../job-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { BriefcaseBusiness } from 'lucide-react'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJob(id)
  if (!job) notFound()

  return <AdminFormPage backHref="/admin/jobs" backLabel="Back to jobs" title="Edit opportunity" description="Update the role details, responsibilities, and visibility of this opportunity." eyebrow="Operations" icon={BriefcaseBusiness}><JobForm
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
      /></AdminFormPage>
}
