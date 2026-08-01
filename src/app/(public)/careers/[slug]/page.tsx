import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getJobBySlug } from '@/lib/queries/jobs'
import { ApplicationForm } from './application-form'

type PageProps = { params: Promise<{ slug: string }> }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://movodream.com'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) return {}

  return {
    title: `${job.title} | Careers at Movodream`,
    description: `${job.title}${job.location ? ` — ${job.location}` : ''}. Join Movodream.`,
    alternates: { canonical: `/careers/${job.slug}` },
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job || job.status === 'draft') notFound()

  const jobUrl = `${SITE_URL}/careers/${job.slug}`
  const isOpen = job.status === 'published'

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.descriptionHtml || job.title,
      datePosted: job.createdAt,
      validThrough: job.applicationDeadline,
      employmentType: job.employmentType?.toUpperCase().replace('-', '_'),
      hiringOrganization: { '@type': 'Organization', name: 'Movodream', sameAs: SITE_URL },
      jobLocation: job.location
        ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location } }
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Careers', item: `${SITE_URL}/careers` },
        { '@type': 'ListItem', position: 2, name: job.title, item: jobUrl },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="content-hero">
        <h1>{job.title}</h1>
        <div className="job-detail-meta">
          {job.department && <span>{job.department}</span>}
          {job.location && <span>{job.location}</span>}
          {job.employmentType && <span>{job.employmentType}</span>}
          {job.experience && <span>{job.experience}</span>}
        </div>
        {job.skills && job.skills.length > 0 && (
          <div className="job-detail-skills">
            {job.skills.map((skill: string) => (
              <span key={skill} className="blog-category-pill">
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      <main className="content-body">
        {job.descriptionHtml && (
          <div dangerouslySetInnerHTML={{ __html: job.descriptionHtml }} />
        )}

        {job.responsibilitiesHtml && (
          <>
            <h2>Responsibilities</h2>
            <div dangerouslySetInnerHTML={{ __html: job.responsibilitiesHtml }} />
          </>
        )}

        {job.applicationDeadline && (
          <p style={{ marginTop: 32, fontWeight: 700 }}>
            Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
          </p>
        )}
      </main>

      <div className="job-apply-section">
        <h2>Apply for this role</h2>
        {isOpen ? (
          <ApplicationForm jobId={job._id} />
        ) : (
          <div className="job-closed-notice">This role is no longer accepting applications.</div>
        )}
      </div>
    </>
  )
}
