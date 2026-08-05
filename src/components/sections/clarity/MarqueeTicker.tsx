import Image from 'next/image'

type Pill = {
  label: string
  colorClass: 'grey' | 'pink' | 'purple' | 'yellow'
  icon: React.ReactNode
}

// Ported from script.js's `pills` array (lines 622–651). Icons extracted to
// static SVGs except "Real-time", which is simple enough to inline (matches
// the original's plain stroke circle+polyline).
//
// Originally rendered as two counter-scrolling infinite marquee rows (each
// pill duplicated 4x for a seamless loop). That read as restless ambient
// motion with no real information gained from the scrolling, so this is now
// one static, centered row of the actual unique pills.
const PILLS: Pill[] = [
  { label: 'Intelligent Planning', colorClass: 'grey', icon: <Image src="/assets/icons/pill-planning.svg" alt="" width={13} height={13} /> },
  { label: 'AI-driven insights', colorClass: 'pink', icon: <Image src="/assets/icons/pill-insights.svg" alt="" width={14} height={13} /> },
  {
    label: 'Real-time',
    colorClass: 'purple',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  { label: 'Smart recommendations', colorClass: 'yellow', icon: <Image src="/assets/icons/s4-tag-yellow-recommend.svg" alt="" width={15} height={15} /> },
  { label: 'Analyze preferences', colorClass: 'grey', icon: <Image src="/assets/icons/pill-analyze.svg" alt="" width={15} height={15} /> },
  { label: 'Understands Intent', colorClass: 'pink', icon: <Image src="/assets/icons/pill-understands.svg" alt="" width={15} height={15} /> },
  { label: 'Adaptive', colorClass: 'purple', icon: <Image src="/assets/icons/pill-adaptive.svg" alt="" width={15} height={15} /> },
  { label: 'Context memory', colorClass: 'yellow', icon: <Image src="/assets/icons/pill-context-memory.svg" alt="" width={15} height={15} /> },
]

export function MarqueeTicker() {
  return (
    <div className="s3-ticker-section">
      <div className="ticker-row">
        {PILLS.map((pill) => (
          <div key={pill.label} className={`ticker-pill ${pill.colorClass}`}>
            <span className={`pill-icon ${pill.colorClass}`}>{pill.icon}</span>
            {pill.label}
          </div>
        ))}
      </div>
    </div>
  )
}
