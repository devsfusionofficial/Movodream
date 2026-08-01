import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedJobs, getJobFilterOptions } from '@/lib/queries/jobs'

export const metadata: Metadata = {
  title: 'Careers | Movodream',
  description: 'Join Movodream and help build the future of AI-powered travel.',
  alternates: { canonical: '/careers' },
}

type PageProps = { searchParams: Promise<{ department?: string; location?: string }> }

export default async function CareersPage({ searchParams }: PageProps) {
  const { department, location } = await searchParams
  const [jobs, filterOptions] = await Promise.all([
    getPublishedJobs({ department, location }),
    getJobFilterOptions(),
  ])

  return (
    <>
      <section className="content-hero">
        <h1>Careers at Movodream</h1>
        <p>Help us build the future of AI-powered travel.</p>
      </section>

      <main className="content-body" style={{ maxWidth: 900 }}>
        <form action="/careers" method="get" className="careers-filters">
          <select name="department" defaultValue={department ?? ''}>
            <option value="">All departments</option>
            {filterOptions.departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select name="location" defaultValue={location ?? ''}>
            <option value="">All locations</option>
            {filterOptions.locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button type="submit" className="blog-category-pill">
            Filter
          </button>
        </form>

        {jobs.length === 0 ? (
          <div className="blog-empty" style={{ marginTop: 32 }}>
            No open roles match these filters right now — check back soon.
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <Link key={job._id} href={`/careers/${job.slug}`} className="job-card">
                <div>
                  <h3>{job.title}</h3>
                  <div className="job-card-meta">
                    {job.department && <span>{job.department}</span>}
                    {job.location && <span>{job.location}</span>}
                    {job.employmentType && <span>{job.employmentType}</span>}
                  </div>
                </div>
                <span className="job-card-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
