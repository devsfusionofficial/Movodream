/**
 * Utility functions for evaluating job deadline status.
 *
 * Requirements:
 * - Compares the deadline in the user's browser local timezone.
 * - A deadline of e.g. "2026-09-03" is valid until 11:59:59 PM (End of Day) on that date
 *   in the user's local timezone.
 * - If the current local browser time exceeds 11:59:59 PM on the deadline date,
 *   or if status is 'closed', the job is considered expired / fulfilled.
 */

export type JobStatusInfo = {
  isExpired: boolean
  isClosed: boolean
  statusBadgeText: string
  actionButtonText: string
  formattedDate: string
}

/**
 * Extracts calendar year, month (0-indexed), and day from a deadline string or Date object.
 * Regardless of whether stored in MongoDB as UTC ISO ("2026-08-31T00:00:00.000Z")
 * or date string ("2026-08-31"), the intended calendar date is extracted.
 */
export function extractCalendarDate(
  deadline: string | Date | null | undefined
): { year: number; month: number; day: number } | null {
  if (!deadline) return null
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  if (!d || Number.isNaN(d.getTime())) return null

  // If deadline was saved via <input type="date">, Mongoose saves it at 00:00:00 UTC.
  // We extract UTC date parts to get the intended date the admin selected.
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
  }
}

/**
 * Returns the exact cutoff Date in the candidate's browser local time.
 * Standard cutoff: 11:59:59 PM (End of Day) on the specified calendar date.
 */
export function getLocalDeadlineCutoff(
  deadline: string | Date | null | undefined
): Date | null {
  const parts = extractCalendarDate(deadline)
  if (!parts) return null
  // In the candidate's browser local timezone, set cutoff to 11:59:59 PM (End of Day)
  return new Date(parts.year, parts.month, parts.day, 23, 59, 59, 999)
}

/**
 * Checks if the job's application deadline has passed in the candidate's browser local time.
 */
export function isJobDeadlinePassed(
  deadline: string | Date | null | undefined,
  now = new Date()
): boolean {
  const cutoff = getLocalDeadlineCutoff(deadline)
  if (!cutoff) return false
  return now.getTime() > cutoff.getTime()
}

/**
 * Determines whether the job is closed or fulfilled.
 * True if status is 'closed' OR deadline has passed.
 */
export function isJobClosedOrExpired(
  job: {
    status?: string
    applicationDeadline?: string | Date | null
  },
  now = new Date()
): boolean {
  if (job.status === 'closed') return true
  if (job.applicationDeadline && isJobDeadlinePassed(job.applicationDeadline, now)) {
    return true
  }
  return false
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Formats a calendar deadline cleanly (e.g. "Aug 31, 2026").
 */
export function formatDeadlineDate(deadline: string | Date | null | undefined): string {
  const parts = extractCalendarDate(deadline)
  if (!parts) return ''
  return `${MONTH_NAMES[parts.month]} ${parts.day}, ${parts.year}`
}

/**
 * Returns complete presentation details for a job tile / detail view.
 */
export function getJobPresentationState(
  job: {
    status?: string
    applicationDeadline?: string | Date | null
  },
  now = new Date()
): JobStatusInfo {
  const isClosed = job.status === 'closed'
  const isDeadlineOver = isJobDeadlinePassed(job.applicationDeadline, now)
  const isExpired = isClosed || isDeadlineOver
  const formattedDate = formatDeadlineDate(job.applicationDeadline)

  if (isClosed) {
    return {
      isExpired: true,
      isClosed: true,
      statusBadgeText: '🛑 Position Fulfilled',
      actionButtonText: 'Applications Closed',
      formattedDate,
    }
  }

  if (isDeadlineOver) {
    return {
      isExpired: true,
      isClosed: false,
      statusBadgeText: formattedDate
        ? `🛑 Deadline Passed • ${formattedDate}`
        : '🛑 Position Fulfilled / Deadline Over',
      actionButtonText: 'Applications Closed',
      formattedDate,
    }
  }

  return {
    isExpired: false,
    isClosed: false,
    statusBadgeText: formattedDate ? `⏳ Apply by ${formattedDate}` : '🟢 Open Role',
    actionButtonText: 'Apply Now →',
    formattedDate,
  }
}
