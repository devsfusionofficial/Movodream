import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getJobBySlug } from '@/lib/queries/jobs'
import { ApplicationForm } from './application-form'
import { formatDate } from '@/lib/date-format'

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
      </section>

      <main className="page-main job-detail-main">
        <div className="job-detail-grid">
          {/* Left Column: Specifications & Content */}
          <div className="job-detail-left">
            <div className="job-overview-card">
              <h3>📌 Role Specifications</h3>
              <div className="job-spec-list">
                {job.department && (
                  <div className="spec-item">
                    <span className="spec-icon">🏢</span>
                    <div>
                      <span className="spec-label">Department</span>
                      <span className="spec-val">{job.department}</span>
                    </div>
                  </div>
                )}
                {job.location && (
                  <div className="spec-item">
                    <span className="spec-icon">📍</span>
                    <div>
                      <span className="spec-label">Location</span>
                      <span className="spec-val">{job.location}</span>
                    </div>
                  </div>
                )}
                {job.employmentType && (
                  <div className="spec-item">
                    <span className="spec-icon">💼</span>
                    <div>
                      <span className="spec-label">Employment Type</span>
                      <span className="spec-val">{job.employmentType}</span>
                    </div>
                  </div>
                )}
                {job.experience && (
                  <div className="spec-item">
                    <span className="spec-icon">⚡</span>
                    <div>
                      <span className="spec-label">Required Experience</span>
                      <span className="spec-val">{job.experience}</span>
                    </div>
                  </div>
                )}
                {job.qualification && (
                  <div className="spec-item">
                    <span className="spec-icon">🎓</span>
                    <div>
                      <span className="spec-label">Qualification</span>
                      <span className="spec-val">{job.qualification}</span>
                    </div>
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="spec-item deadline">
                    <span className="spec-icon">⏳</span>
                    <div>
                      <span className="spec-label">Application Deadline</span>
                      <span className="spec-val">
                        {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {job.descriptionHtml ? (
              <div className="job-section-card">
                <h3>📖 Role Overview</h3>
                <div className="page-prose" dangerouslySetInnerHTML={{ __html: job.descriptionHtml }} />
              </div>
            ) : (
              <div className="job-section-card">
                <h3>📖 Role Overview</h3>
                <p className="job-placeholder-text">
                  Movodream is hiring a <strong>{job.title}</strong> to join our team in <strong>{job.location || 'India'}</strong>. As part of this role, you will collaborate with our engineering, product, and AI teams to deliver world-class travel companion experiences.
                </p>
              </div>
            )}

            {job.responsibilitiesHtml && (
              <div className="job-section-card">
                <h3>🎯 Key Responsibilities</h3>
                <div className="page-prose" dangerouslySetInnerHTML={{ __html: job.responsibilitiesHtml }} />
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="job-section-card">
                <h3>🛠️ Preferred Skills & Technologies</h3>
                <div className="job-skills-flex">
                  {job.skills.map((skill: string) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Application Panel */}
          <div className="job-detail-right">
            <div className="job-sticky-panel" id="apply">
              <div className="panel-header">
                <h2>Apply for this role</h2>
                <p>Tell us about yourself and attach your CV — we review every application.</p>
              </div>
              {isOpen ? (
                <ApplicationForm jobId={job._id} />
              ) : (
                <div className="job-closed-box">This role is no longer accepting applications.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
