'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { PublishedJobItem } from '@/lib/queries/jobs'
import { getJobPresentationState, isJobClosedOrExpired } from '@/lib/job-status'

export function CareerRoleCount({ jobs }: { jobs: PublishedJobItem[] }) {
  const activeCount = useMemo(() => {
    return jobs.filter((j) => !isJobClosedOrExpired(j)).length
  }, [jobs])

  const closedCount = jobs.length - activeCount

  return (
    <span className="post-tile-meta">
      <strong>{activeCount}</strong> open role{activeCount === 1 ? '' : 's'}
      {closedCount > 0 && (
        <span className="meta-closed-count"> ({closedCount} closed)</span>
      )}
    </span>
  )
}

type CareerJobListProps = {
  jobs: PublishedJobItem[]
}

export function CareerJobList({ jobs }: CareerJobListProps) {
  // Client-side browser local time evaluation
  const { activeJobs, pastJobs } = useMemo(() => {
    const active: Array<{ job: PublishedJobItem; state: ReturnType<typeof getJobPresentationState> }> = []
    const past: Array<{ job: PublishedJobItem; state: ReturnType<typeof getJobPresentationState> }> = []

    for (const job of jobs) {
      const state = getJobPresentationState(job)
      if (state.isExpired) {
        past.push({ job, state })
      } else {
        active.push({ job, state })
      }
    }

    return { activeJobs: active, pastJobs: past }
  }, [jobs])

  return (
    <div className="career-jobs-wrapper">
      {/* Active Open Positions */}
      {activeJobs.length > 0 && (
        <div className="job-list">
          {activeJobs.map(({ job, state }) => (
            <Link key={job._id} href={`/careers/${job.slug}`} className="job-tile">
              <div className="job-tile-content">
                <div className="job-tile-header">
                  <h3>{job.title}</h3>
                  {job.department && <span className="job-dept-badge">{job.department}</span>}
                </div>

                <div className="job-tile-specs">
                  {job.location && <span className="spec-tag">📍 {job.location}</span>}
                  {job.employmentType && <span className="spec-tag">💼 {job.employmentType}</span>}
                  {job.experience && <span className="spec-tag">⚡ {job.experience}</span>}
                </div>

                {job.shortDescription && (
                  <div className="job-tile-desc-box">
                    <p className="job-tile-desc">{job.shortDescription}</p>
                  </div>
                )}

                <div className="job-tile-footer">
                  <span className={job.applicationDeadline ? 'deadline-badge' : 'job-status-tag'}>
                    {state.statusBadgeText}
                  </span>
                  <span className="job-tile-action">
                    Apply Now <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Past Openings & Fulfilled Roles (Always Rendered at Bottom) */}
      {pastJobs.length > 0 && (
        <div className="past-jobs-container">
          <div className="past-jobs-divider">
            <div className="past-jobs-divider-line" />
            <div className="past-jobs-heading-box">
              <span className="past-jobs-icon">📁</span>
              <span className="past-jobs-title">
                Past Openings & Fulfilled Roles ({pastJobs.length})
              </span>
            </div>
            <div className="past-jobs-divider-line" />
          </div>
          <p className="past-jobs-note">
            The application deadline for these positions has passed. They are preserved for candidate reference.
          </p>

          <div className="job-list past-job-list">
            {pastJobs.map(({ job, state }) => (
              <Link
                key={job._id}
                href={`/careers/${job.slug}`}
                className="job-tile is-expired"
                aria-label={`${job.title} - Applications Closed`}
              >
                <div className="job-tile-content">
                  <div className="job-tile-header">
                    <div className="title-with-status">
                      <h3>{job.title}</h3>
                      <span className="expired-pill-badge">Deadline Over</span>
                    </div>
                    {job.department && <span className="job-dept-badge is-muted">{job.department}</span>}
                  </div>

                  <div className="job-tile-specs">
                    {job.location && <span className="spec-tag">📍 {job.location}</span>}
                    {job.employmentType && <span className="spec-tag">💼 {job.employmentType}</span>}
                    {job.experience && <span className="spec-tag">⚡ {job.experience}</span>}
                  </div>

                  {job.shortDescription && (
                    <div className="job-tile-desc-box is-muted">
                      <p className="job-tile-desc is-muted">{job.shortDescription}</p>
                    </div>
                  )}

                  <div className="job-tile-footer">
                    <span className="deadline-badge is-expired">
                      {state.statusBadgeText}
                    </span>
                    <span className="job-tile-action is-closed">
                      <span className="lock-icon">🔒</span>
                      <span>Applications Closed</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
