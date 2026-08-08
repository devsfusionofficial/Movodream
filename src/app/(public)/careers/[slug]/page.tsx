import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
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
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="page-crumb">
        <Link href="/">Home</Link> › <Link href="/careers">Careers</Link> › <span>{job.title}</span>
      </section>

      <section className="page-head">
        <span className="page-eyebrow">Open role</span>
        <h1>{job.title}</h1>
        <div className="job-tile-meta" style={{ marginTop: 18 }}>
          {job.department && <span>{job.department}</span>}
          {job.location && <span>{job.location}</span>}
          {job.employmentType && <span>{job.employmentType}</span>}
          {job.experience && <span>{job.experience}</span>}
        </div>
        {job.skills && job.skills.length > 0 && (
          <div className="page-pills" style={{ marginTop: 12 }}>
            {job.skills.map((skill: string) => (
              <span key={skill} className="page-pill">
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      <main className="page-main page-article">
        <div className="page-prose">
          {job.descriptionHtml && <div dangerouslySetInnerHTML={{ __html: job.descriptionHtml }} />}

          {job.responsibilitiesHtml && (
            <>
              <h2>Responsibilities</h2>
              <div dangerouslySetInnerHTML={{ __html: job.responsibilitiesHtml }} />
            </>
          )}

          {job.qualification && (
            <>
              <h2>Qualification</h2>
              <p>{job.qualification}</p>
            </>
          )}

          {job.applicationDeadline && (
            <p>
              <strong>Application deadline:</strong>{' '}
              {new Date(job.applicationDeadline).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <div className="job-apply" id="apply">
          <h2>Apply for this role</h2>
          {isOpen ? (
            <>
              <p>Tell us a little about yourself and attach your CV — we read every application.</p>
              <ApplicationForm jobId={job._id} />
            </>
          ) : (
            <div className="job-closed">This role is no longer accepting applications.</div>
          )}
        </div>
      </main>
    </div>
  )
}
