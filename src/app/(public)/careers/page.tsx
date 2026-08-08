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
  const isFiltered = Boolean(department || location)

  return (
    <div className="page-shell">
      <section className="page-crumb">
        <Link href="/">Home</Link> › <span>Careers</span>
      </section>

      <section className="page-head">
        <span className="page-eyebrow">Careers at Movodream</span>
        <h1>
          Help us build the future of <span className="p">AI-powered travel.</span>
        </h1>
        <p className="page-head-lead">
          We&apos;re travelers, technologists, designers and storytellers building an intelligent travel companion
          from India, for the world.
        </p>
      </section>

      <main className="page-main">
        <div className="page-toolbar">
          <form action="/careers" method="get" className="page-filters">
            <select name="department" defaultValue={department ?? ''} aria-label="Filter by department" className="page-select">
              <option value="">All departments</option>
              {filterOptions.departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select name="location" defaultValue={location ?? ''} aria-label="Filter by location" className="page-select">
              <option value="">All locations</option>
              {filterOptions.locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button type="submit" className="page-pill active">
              Apply filters
            </button>
            {isFiltered && (
              <Link href="/careers" className="page-pill">
                Clear
              </Link>
            )}
          </form>

          <span className="post-tile-meta">
            {jobs.length} open role{jobs.length === 1 ? '' : 's'}
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="page-empty">
            {isFiltered
              ? 'No open roles match these filters right now.'
              : 'No open roles right now — check back soon.'}
          </div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <Link key={job._id} href={`/careers/${job.slug}`} className="job-tile">
                <div>
                  <h3>{job.title}</h3>
                  <div className="job-tile-meta">
                    {job.department && <span>{job.department}</span>}
                    {job.location && <span>{job.location}</span>}
                    {job.employmentType && <span>{job.employmentType}</span>}
                    {job.experience && <span>{job.experience}</span>}
                  </div>
                </div>
                <span className="job-tile-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
