'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { getJobPresentationState } from '@/lib/job-status'
import { ApplicationForm } from './application-form'

type JobInfo = {
  _id: string
  title: string
  status?: string
  applicationDeadline?: string | Date | null
}

export function JobDetailEyebrow({ job }: { job: JobInfo }) {
  const state = useMemo(() => getJobPresentationState(job), [job])

  if (state.isExpired) {
    return <span className="page-eyebrow is-closed">🔒 Applications Closed</span>
  }

  return <span className="page-eyebrow is-open">🟢 Open role</span>
}

export function JobClosedBanner({ job }: { job: JobInfo }) {
  const state = useMemo(() => getJobPresentationState(job), [job])

  if (!state.isExpired) return null

  return (
    <div className="job-closed-alert-banner" role="alert">
      <span className="banner-icon">📢</span>
      <div className="banner-content">
        <h4>Position Fulfilled / Deadline Over</h4>
        <p>
          The application deadline for this position was{' '}
          <strong>{state.formattedDate || 'in the past'} at 11:59 PM</strong>. We are no longer
          accepting new applications for this opening.
        </p>
      </div>
    </div>
  )
}

export function JobApplySection({ job }: { job: JobInfo }) {
  const state = useMemo(() => getJobPresentationState(job), [job])

  if (state.isExpired) {
    return (
      <div className="job-closed-card">
        <div className="closed-icon-badge">🔒</div>
        <h2>Applications Are Closed</h2>
        <p className="closed-desc">
          The deadline for <strong>{job.title}</strong> has passed (
          {state.formattedDate ? `ended ${state.formattedDate} at 11:59 PM` : 'deadline over'}). This role is fulfilled
          or no longer reviewing new candidates.
        </p>
        <div className="closed-status-pill">
          <span className="status-indicator" />
          <span>Position Fulfilled • Deadline Over</span>
        </div>
        <Link href="/careers" className="closed-back-btn">
          ← Explore Current Open Roles
        </Link>
      </div>
    )
  }

  return (
    <div className="job-sticky-panel" id="apply">
      <div className="panel-header">
        <h2>Apply for this role</h2>
        <p>Tell us about yourself and attach your CV — we review every application.</p>
      </div>
      <ApplicationForm jobId={job._id} />
    </div>
  )
}
