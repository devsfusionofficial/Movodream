const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Formats dates consistently across all admin dashboard pages.
 * When running in the browser, formats in the user's local timezone.
 */
export function formatAdminDate(value: string | Date | null | undefined, includeTime = false) {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (!date || Number.isNaN(date.getTime())) return '—'

  // Browser-side local time formatting
  if (typeof window !== 'undefined') {
    try {
      if (includeTime) {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(date)
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    } catch {
      const month = MONTHS[date.getMonth()]
      const day = date.getDate()
      const year = date.getFullYear()
      if (!includeTime) return `${month} ${day}, ${year}`
      const hours = date.getHours()
      const hour = hours % 12 || 12
      const minute = String(date.getMinutes()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      return `${month} ${day}, ${year}, ${hour}:${minute} ${ampm}`
    }
  }

  // Server-side fallback
  const month = MONTHS[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()

  if (!includeTime) return `${month} ${day}, ${year}`

  const hours = date.getUTCHours()
  const hour = hours % 12 || 12
  const minute = String(date.getUTCMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  return `${month} ${day}, ${year}, ${hour}:${minute} ${ampm}`
}

/**
 * Provides a user-friendly relative date ("Today", "Yesterday", "3 days ago")
 * for recent events, falling back to "Aug 30, 2026" for older dates.
 */
export function formatAdminRelativeDate(value: string | Date | null | undefined) {
  if (!value) return 'Recently'
  const date = typeof value === 'string' ? new Date(value) : value
  if (!date || Number.isNaN(date.getTime())) return 'Recently'

  const now = Date.now()
  const diffDays = Math.floor((now - date.getTime()) / 86400000)

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return formatAdminDate(date)
}

export const formatDate = formatAdminDate
