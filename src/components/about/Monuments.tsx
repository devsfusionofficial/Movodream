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

/** Bengaluru — Vidhana Soudha. */
export function VidhanaSoudha({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        <path d="M14 108h92" />
        <path d="M20 108v-6h80v6" />
        <path d="M24 102V68h72v34" />
        <path d="M48 102V76h24v26" />
        <path d="M54 102V86a6 6 0 0112 0v16" />
        <path d="M30 102V72M38 102V72M82 102V72M90 102V72" />
        <path d="M22 68h76" />
        <path d="M44 68V62h32v6" />
        <path d="M48 62c0-14 12-22 12-22s12 8 12 22" />
        <path d="M60 40v-14" />
        <path d="M57 26h6" />
        <path d="M26 68V60h8v8" />
        <path d="M26 60a4 4 0 018 0" />
        <path d="M30 56v-6" />
        <path d="M86 68V60h8v8" />
        <path d="M86 60a4 4 0 018 0" />
        <path d="M90 56v-6" />
      </g>
    </svg>
  )
}

/** Dubai — Burj Khalifa. */
export function BurjKhalifa({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        <path d="M20 108h80" />
        <path d="M32 108v-10h56v10" />
        <path d="M38 98v-16h44v16" />
        <path d="M44 82v-16h32v16" />
        <path d="M48 66v-16h24v16" />
        <path d="M52 50v-16h16v16" />
        <path d="M55 34v-12h10v12" />
        <path d="M57 22v-8h6v8" />
        <path d="M60 14V6" />
        <path d="M60 108V14" />
        <path d="M38 98h44M44 82h32M48 66h24M52 50h16M55 34h10M57 22h6" />
        <path d="M26 108v-6h6v6M88 108v-6h6v6" />
      </g>
    </svg>
  )
}

/** Australia — Sydney Opera House. */
export function SydneyOperaHouse({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        <path d="M12 108h96" />
        <path d="M18 108v-6h84v6" />
        <path d="M22 102V90h76v12" />
        <path d="M26 90C28 58 48 38 66 38c-2 18-3 36-14 52" />
        <path d="M38 90C40 66 54 50 66 38" />
        <path d="M52 90C54 66 70 48 82 48c-2 16-3 28-10 42" />
        <path d="M62 90C64 72 74 58 82 48" />
        <path d="M72 90C74 76 86 64 96 64c-2 10-3 18-8 26" />
        <path d="M24 90C22 78 26 68 32 64c0 8 0 18-2 26" />
      </g>
    </svg>
  )
}

/** Kolkata — Victoria Memorial. */
export function VictoriaMemorial({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g {...line}>
        {/* Baseline & Stepped Plinth */}
        <path d="M6 108h108" />
        <path d="M10 108v-3h100v3" />

        {/* Left Corner Tower */}
        <path d="M12 105V66h16v39" />
        <path d="M10 66h20" />
        <path d="M13 66V52h14v14" />
        <path d="M13 52c0-7 7-11 7-11s7 4 7 11" />
        <path d="M20 41v-6" />
        <path d="M19 74h2v14h-2z" />
        <path d="M19 94h2v8h-2z" />

        {/* Right Corner Tower */}
        <path d="M92 105V66h16v39" />
        <path d="M90 66h20" />
        <path d="M93 66V52h14v14" />
        <path d="M93 52c0-7 7-11 7-11s7 4 7 11" />
        <path d="M100 41v-6" />
        <path d="M99 74h2v14h-2z" />
        <path d="M99 94h2v8h-2z" />

        {/* Left Colonnade Wing */}
        <path d="M28 105V74h18v31" />
        <path d="M34 105V82h4v23" />
        <path d="M42 105V82h4v23" />

        {/* Right Colonnade Wing */}
        <path d="M74 105V74h18v31" />
        <path d="M74 105V82h4v23" />
        <path d="M82 105V82h4v23" />

        {/* Cornice */}
        <path d="M28 74h64" />

        {/* Central Block */}
        <path d="M46 105V64h28v41" />
        <path d="M44 64h32" />

        {/* Grand Central Arch */}
        <path d="M52 105V84a8 8 0 0116 0v21" />
        <path d="M56 105V93a4 4 0 018 0v12" />

        {/* Niches */}
        <path d="M48 82h2v16h-2zM70 82h2v16h-2z" />

        {/* Central Dome Drum Base */}
        <path d="M42 64V58h36v6" />
        <path d="M40 58h40" />
        <path d="M47 58V50h26v8" />
        <path d="M51 58V52M56 58V52M60 58V52M64 58V52M69 58V52" />

        {/* Grand Central Dome */}
        <path d="M45 50c0-16 15-24 15-24s15 8 15 24" />
        <path d="M51 50c2-10 9-16 9-16s7 6 9 16" />
        <path d="M60 50V26" />

        {/* Cupola & Angel of Victory */}
        <path d="M57 26h6v-4h-6z" />
        <path d="M58 22c0-2 2-3 2-3s2 1 2 3" />
        <path d="M60 19V9" />
        <path d="M56 13l4-4 4 4" />
        <path d="M57 11a3 3 0 016 0" />
      </g>
    </svg>
  )
}

