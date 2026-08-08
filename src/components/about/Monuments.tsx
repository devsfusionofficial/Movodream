/**
 * Faint line-art landmarks that sit behind each office card, matching the
 * reference. Stroke only, `currentColor`, so the card controls the tint.
 */
type Props = { className?: string }

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Delhi — India Gate. */
export function IndiaGate({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        <path d="M22 108h76" />
        <path d="M32 108V44h56v64" />
        <path d="M32 44l28-16 28 16" />
        <path d="M50 108V72a10 10 0 0120 0v36" />
        <path d="M38 52h44M38 60h44" />
        <path d="M42 30h36M46 24h28" />
        <path d="M28 108v-8h64v8" />
      </g>
    </svg>
  )
}

/** Mumbai — Gateway of India. */
export function GatewayOfIndia({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        <path d="M18 108h84" />
        <path d="M28 108V46h64v62" />
        <path d="M46 108V74a14 14 0 0128 0v34" />
        <path d="M28 46h64" />
        <path d="M34 46V34h10v12M76 46V34h10v12" />
        <path d="M39 34a5 5 0 0110 0M81 34a5 5 0 0110 0" />
        <path d="M52 46V36h16v10" />
        <path d="M54 36a6 6 0 0112 0" />
        <path d="M24 108v-9h72v9" />
      </g>
    </svg>
  )
}

/** Amritsar — Golden Temple. */
export function GoldenTemple({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        <path d="M14 108h92" />
        <path d="M26 108V60h68v48" />
        <path d="M26 60h68" />
        <path d="M60 24v10" />
        <path d="M46 60V46h28v14" />
        <path d="M46 46a14 14 0 0128 0" />
        <path d="M34 60V52h8v8M78 60V52h8v8" />
        <path d="M36 52a3 3 0 016 0M80 52a3 3 0 016 0" />
        <path d="M40 108V80h12v28M68 108V80h12v28" />
        <path d="M56 108V84h8v24" />
        <path d="M20 108v-8h80v8" />
      </g>
    </svg>
  )
}
