/**
 * Admin dates are formatted with an explicit UTC timezone so the server and
 * browser produce identical markup during hydration, regardless of the
 * visitor's local timezone or locale settings.
 */
export function formatAdminDate(value: string | Date | null | undefined, includeTime = false) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const year = date.getUTCFullYear()
  if (!includeTime) return `${month}/${day}/${year}`

  const hours = date.getUTCHours()
  const hour = hours % 12 || 12
  const minute = String(date.getUTCMinutes()).padStart(2, '0')
  return `${month}/${day}/${year}, ${hour}:${minute} ${hours >= 12 ? 'PM' : 'AM'} UTC`
}
