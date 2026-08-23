'use client'

import Image from 'next/image'

type Pill = {
  label: string
  colorClass: 'grey' | 'pink' | 'purple' | 'yellow'
  icon: React.ReactNode
}

const PILLS: Pill[] = [
  {
    label: 'Intelligent Planning',
    colorClass: 'grey',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 1.25C4.05 1.25 1.25 4.05 1.25 7.5C1.25 10.95 4.05 13.75 7.5 13.75C10.95 13.75 13.75 10.95 13.75 7.5C13.75 4.05 10.95 1.25 7.5 1.25ZM7.5 12.5C4.74 12.5 2.5 10.26 2.5 7.5C2.5 4.74 4.74 2.5 7.5 2.5C10.26 2.5 12.5 4.74 12.5 7.5C12.5 10.26 10.26 12.5 7.5 12.5ZM7.5 3.75C6.4 3.75 5.5 4.65 5.5 5.75H6.75C6.75 5.34 7.09 5 7.5 5C7.91 5 8.25 5.34 8.25 5.75C8.25 6.5 7.12 6.31 7.12 7.62H8.38C8.38 6.94 9.5 6.75 9.5 5.75C9.5 4.65 8.6 3.75 7.5 3.75ZM6.88 8.75H8.12V10H6.88V8.75Z" fill="currentColor"/>
      </svg>
    ),
  },
  { label: 'AI-driven insights', colorClass: 'pink', icon: <Image src="/assets/icons/pill-insights.svg" alt="" width={15} height={15} style={{ width: 'auto', height: 'auto' }} /> },
  {
    label: 'Real-time',
    colorClass: 'purple',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7.5" cy="7.5" r="6.25" />
        <polyline points="7.5 3.75 7.5 7.5 10 8.75" />
      </svg>
    ),
  },
  { label: 'Smart recommendations', colorClass: 'yellow', icon: <Image src="/assets/icons/s4-tag-yellow-recommend.svg" alt="" width={15} height={15} style={{ width: 'auto', height: 'auto' }} /> },
  { label: 'Analyze preferences', colorClass: 'grey', icon: <Image src="/assets/icons/pill-analyze.svg" alt="" width={15} height={15} style={{ width: 'auto', height: 'auto' }} /> },
  { label: 'Understands Intent', colorClass: 'pink', icon: <Image src="/assets/icons/pill-understands.svg" alt="" width={15} height={15} style={{ width: 'auto', height: 'auto' }} /> },
  { label: 'Adaptive', colorClass: 'purple', icon: <Image src="/assets/icons/pill-adaptive.svg" alt="" width={15} height={15} style={{ width: 'auto', height: 'auto' }} /> },
  { label: 'Context memory', colorClass: 'yellow', icon: <Image src="/assets/icons/pill-context-memory.svg" alt="" width={15} height={15} style={{ width: 'auto', height: 'auto' }} /> },
]

// Duplicate pills arrays for 100% seamless infinite scrolling loop
const ROW_1_PILLS = [...PILLS, ...PILLS, ...PILLS, ...PILLS]
const ROW_2_PILLS = [...PILLS.slice(4), ...PILLS.slice(0, 4), ...PILLS, ...PILLS, ...PILLS]

export function MarqueeTicker() {
  return (
    <div className="s3-ticker-section">
      {/* Row 1 -> scrolls left */}
      <div className="ticker-row ticker-row-1">
        {ROW_1_PILLS.map((pill, idx) => (
          <div key={`r1-${pill.label}-${idx}`} className={`ticker-pill ${pill.colorClass}`}>
            <span className={`pill-icon ${pill.colorClass}`}>{pill.icon}</span>
            {pill.label}
          </div>
        ))}
      </div>

      {/* Row 2 -> scrolls right */}
      <div className="ticker-row ticker-row-2">
        {ROW_2_PILLS.map((pill, idx) => (
          <div key={`r2-${pill.label}-${idx}`} className={`ticker-pill ${pill.colorClass}`}>
            <span className={`pill-icon ${pill.colorClass}`}>{pill.icon}</span>
            {pill.label}
          </div>
        ))}
      </div>
    </div>
  )
}
