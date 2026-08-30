'use client'

import { useEffect, useState } from 'react'
import { formatAdminRelativeDate } from '@/lib/date-format'

interface FormattedDateProps {
  date: string | Date | null | undefined
  includeTime?: boolean
  className?: string
  fallback?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Client component that displays dates in the user's exact browser timezone.
 * Hydration-safe: instantly adjusts to local browser time on client mount.
 */
export function FormattedDate({ date, includeTime = false, className, fallback = '—' }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>(() => {
    if (!date) return fallback
    const d = typeof date === 'string' ? new Date(date) : date
    if (!d || Number.isNaN(d.getTime())) return fallback
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
  })

  useEffect(() => {
    if (!date) return
    const d = typeof date === 'string' ? new Date(date) : date
    if (!d || Number.isNaN(d.getTime())) return

    try {
      if (includeTime) {
        const formattedStr = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(d)
        setFormatted(formattedStr)
      } else {
        const formattedStr = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(d)
        setFormatted(formattedStr)
      }
    } catch {
      const month = MONTHS[d.getMonth()]
      const day = d.getDate()
      const year = d.getFullYear()
      if (!includeTime) {
        setFormatted(`${month} ${day}, ${year}`)
      } else {
        const hours = d.getHours()
        const hour = hours % 12 || 12
        const minute = String(d.getMinutes()).padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
        setFormatted(`${month} ${day}, ${year}, ${hour}:${minute} ${ampm}`)
      }
    }
  }, [date, includeTime])

  return (
    <span className={className} suppressHydrationWarning>
      {formatted}
    </span>
  )
}

export function FormattedRelativeDate({
  date,
  className,
  fallback = 'Recently',
}: {
  date: string | Date | null | undefined
  className?: string
  fallback?: string
}) {
  const [formatted, setFormatted] = useState<string>(() => {
    if (!date) return fallback
    return formatAdminRelativeDate(date)
  })

  useEffect(() => {
    if (!date) return
    setFormatted(formatAdminRelativeDate(date))
  }, [date])

  return (
    <span className={className} suppressHydrationWarning>
      {formatted}
    </span>
  )
}
