import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedJobsPaginated, getJobFilterOptions } from '@/lib/queries/jobs'
import { Pagination } from '@/components/ui/Pagination'
import { JobFilters } from './job-filters'
import { ApplicationSuccessToast } from './application-success-toast'
import { CareerJobList, CareerRoleCount } from './career-job-list'

export const metadata: Metadata = {
  title: 'Careers | Movodream',
  description: 'Join Movodream and help build the future of AI-powered travel.',
  alternates: { canonical: '/careers' },
}

type PageProps = { searchParams: Promise<{ department?: string; location?: string; page?: string }> }

export default async function CareersPage({ searchParams }: PageProps) {
  const { department, location, page: rawPage } = await searchParams
  const currentPage = parseInt(rawPage || '1', 10) || 1

  const [{ jobs, totalJobs, totalPages }, filterOptions] = await Promise.all([
    getPublishedJobsPaginated({ department, location, page: currentPage, limit: 6 }),
    getJobFilterOptions(),
  ])

  return (
    <div className="page-shell">
      <Suspense fallback={null}>
        <ApplicationSuccessToast />
      </Suspense>
      <section className="page-crumb">
        <Link href="/">Home</Link> › <span>Careers</span>
      </section>

      <section className="page-head">
        <span className="page-eyebrow">Careers at Movodream</span>
        <h1>
          Ideas. Impact. <span className="p">Opportunity.</span>
        </h1>
      </section>

      <main className="page-main">
        <div className="page-toolbar">
          <JobFilters
            departments={filterOptions.departments}
            locations={filterOptions.locations}
            initialDepartment={department ?? ''}
            initialLocation={location ?? ''}
          />

          <CareerRoleCount jobs={jobs} />
        </div>

        {jobs.length === 0 ? (
          <div className="career-empty-container">
            <div className="career-empty-card">
              <div className="career-glow-backdrop" />
              <div className="career-empty-badge">
                <span className="badge-star">✨</span>
                <span>Hiring Status Update</span>
              </div>
              <h2>All Positions Are Currently Filled</h2>
              <p>
                Our team is currently fully staffed, and we are not actively reviewing new applications at this time.
                We periodically publish new opportunities here as our engineering, product, and AI teams expand. Thank you
                for your interest in Movodream.
              </p>
              <div className="career-empty-actions">
                <div className="career-status-pill">
                  <span className="pulse-dot" />
                  <span>Check Back Soon For Future Openings</span>
                </div>
              </div>
            </div>

            <div className="career-perks-section">
              <h2 className="perks-title">Why Build at Movodream?</h2>
              <div className="perks-grid">
                <div className="perk-card">
                  <div className="perk-icon">🧠</div>
                  <h3>AI-First Innovation</h3>
                  <p>Build cutting-edge AI travel technology and personalized intelligence for modern global travelers.</p>
                </div>
                <div className="perk-card">
                  <div className="perk-icon">🌍</div>
                  <h3>Remote-Flexible Culture</h3>
                  <p>Work with autonomy and flexibility. We prioritize high ownership, deep focus, and output.</p>
                </div>
                <div className="perk-card">
                  <div className="perk-icon">⚡</div>
                  <h3>Rapid Growth & Equity</h3>
                  <p>Enjoy competitive compensation, learning stipends, health benefits, and career growth.</p>
                </div>
                <div className="perk-card">
                  <div className="perk-icon">🚀</div>
                  <h3>Global Scale from India</h3>
                  <p>Be part of a world-class team building next-generation consumer travel tech from India for the world.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <CareerJobList jobs={jobs} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </main>
    </div>
  )
}
