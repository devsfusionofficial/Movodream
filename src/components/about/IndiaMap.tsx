type Pin = { label: string; x: number; y: number; live: boolean }

const PINS: Pin[] = [
  { label: 'Delhi', x: 150, y: 108, live: true },
  { label: 'Amritsar', x: 108, y: 62, live: true },
  { label: 'Mumbai', x: 108, y: 232, live: true },
]

/**
 * Decorative, illustrative India silhouette — not a survey-accurate map.
 * Pins mark the three real Movodream offices (Delhi, Mumbai, Amritsar);
 * everything else is a dot-matrix fill in the same hand-authored style as
 * the Advantage-section SVGs.
 */
export function IndiaMap({ className }: { className?: string }) {
  const dotRows: { y: number; count: number; startX: number }[] = []
  const spacing = 14
  for (let y = 20; y <= 300; y += spacing) {
    const t = y / 300
    const widthFactor = t < 0.55 ? 0.55 + t * 0.7 : 1 - (t - 0.55) * 1.35
    const rowWidth = Math.max(40, 150 * Math.max(widthFactor, 0.12))
    const count = Math.max(2, Math.round(rowWidth / spacing))
    const startX = 130 - (count - 1) * (spacing / 2)
    dotRows.push({ y, count, startX })
  }

  return (
    <svg viewBox="0 0 260 320" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="india-dot" cx="30%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#c96fe0" />
          <stop offset="100%" stopColor="#7b3fd1" />
        </radialGradient>
      </defs>
      {dotRows.map((row) =>
        Array.from({ length: row.count }).map((_, i) => (
          <circle
            key={`${row.y}-${i}`}
            cx={row.startX + i * spacing}
            cy={row.y}
            r={2.1}
            fill="url(#india-dot)"
            opacity={0.55}
          />
        ))
      )}
      {PINS.map((pin) => (
        <g key={pin.label}>
          <circle cx={pin.x} cy={pin.y} r={13} fill="rgba(168,85,247,0.14)" />
          <circle cx={pin.x} cy={pin.y} r={6} fill="#fff" stroke="#a855f7" strokeWidth={2.4} />
          <text
            x={pin.x + 18}
            y={pin.y + 4}
            fontSize="12"
            fontWeight={700}
            fill="#3a1259"
            style={{ fontFamily: 'inherit' }}
          >
            {pin.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
