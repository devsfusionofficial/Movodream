import Image from 'next/image'

type Pill = {
  label: string
  colorClass: 'grey' | 'pink' | 'purple' | 'yellow'
  icon: React.ReactNode
}

// Ported from script.js's `pills` array (lines 622–651). Icons extracted to
// static SVGs except "Real-time", which is simple enough to inline (matches
// the original's plain stroke circle+polyline).
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

function TickerRow({ id, direction }: { id: string; direction: 'left' | 'right' }) {
  // Ported from buildRow(): the pills array duplicated 4x so the CSS
  // translateX(-50%) loop animation has no visible seam.
  const doubled = [...PILLS, ...PILLS, ...PILLS, ...PILLS]
  return (
    <div id={id} className={`ticker-row ${direction === 'left' ? 'ticker-row-1' : 'ticker-row-2'}`}>
      {doubled.map((pill, i) => (
        <div key={i} className={`ticker-pill ${pill.colorClass}`}>
          <span className={`pill-icon ${pill.colorClass}`}>{pill.icon}</span>
          {pill.label}
        </div>
      ))}
    </div>
  )
}

export function MarqueeTicker() {
  return (
    <div className="s3-ticker-section">
      <TickerRow id="row1" direction="left" />
      <TickerRow id="row2" direction="right" />
    </div>
  )
}
