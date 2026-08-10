/**
 * Icon set for the About page. Kept local (same convention as
 * components/legal/icons.tsx) rather than pulled from a library — all draw
 * on a 24×24 grid and inherit `currentColor`.
 */
type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.4a8.4 8.4 0 100-16.8 8.4 8.4 0 000 16.8z M12 15.8a3.8 3.8 0 100-7.6 3.8 3.8 0 000 7.6z M12 12.4a.4.4 0 11.001-.001"
        {...stroke}
      />
    </svg>
  )
}

export function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.4a8.4 8.4 0 100-16.8 8.4 8.4 0 000 16.8z M14.8 9.2l-1.6 4.4-4.4 1.6 1.6-4.4 4.4-1.6z"
        {...stroke}
      />
    </svg>
  )
}

export function NavigateIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2.6L3.6 20.4l8.4-4 8.4 4L12 2.6z" {...stroke} />
    </svg>
  )
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21.4S5 15.2 5 10a7 7 0 0114 0c0 5.2-7 11.4-7 11.4z M12 12.6a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z"
        {...stroke}
      />
    </svg>
  )
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.4a8.4 8.4 0 100-16.8 8.4 8.4 0 000 16.8z M3.6 12h16.8 M12 3.6a12.8 12.8 0 013.2 8.4A12.8 12.8 0 0112 20.4 12.8 12.8 0 018.8 12 12.8 12.8 0 0112 3.6z"
        {...stroke}
      />
    </svg>
  )
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M2.4 12S5.8 5.6 12 5.6 21.6 12 21.6 12 18.2 18.4 12 18.4 2.4 12 2.4 12z M12 14.8a2.8 2.8 0 100-5.6 2.8 2.8 0 000 5.6z"
        {...stroke}
      />
    </svg>
  )
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.2l-1.4-1.3C5.6 14.4 2.8 11.9 2.8 8.8a4.6 4.6 0 018.2-2.8l1 1.3 1-1.3a4.6 4.6 0 018.2 2.8c0 3.1-2.8 5.6-7.8 10.1L12 20.2z"
        {...stroke}
      />
    </svg>
  )
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3.2l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1L5 10.2l5.1-1.9L12 3.2z M18.4 16.4l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"
        {...stroke}
      />
    </svg>
  )
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3.2l7 2.6v5.6c0 4.2-2.9 7.4-7 9.4-4.1-2-7-5.2-7-9.4V5.8l7-2.6z" {...stroke} />
    </svg>
  )
}
