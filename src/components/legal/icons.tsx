/**
 * Inline icon set for the static content pages. Kept local rather than
 * pulled from a library — these are the only icons the legal/support shell
 * needs, and inlining them avoids shipping an icon package for four pages.
 * All draw on a 24×24 grid and inherit `currentColor`.
 */
type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2.6l7 2.6v5.6c0 4.3-2.9 8.2-7 9.6-4.1-1.4-7-5.3-7-9.6V5.2l7-2.6z M8.9 12l2.1 2.1 4-4.2" {...stroke} />
    </svg>
  )
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5.2l3.4 2" {...stroke} />
    </svg>
  )
}

export function RefundIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18z M9 7.6h6 M9 10.6h6 M14.4 7.6c0 2-1.4 3-3.3 3H9l4.6 5.8" {...stroke} />
    </svg>
  )
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5.8 10.4h12.4c.6 0 1 .5 1 1v8c0 .6-.4 1-1 1H5.8c-.6 0-1-.4-1-1v-8c0-.5.4-1 1-1z M8 10.4V7.6a4 4 0 018 0v2.8" {...stroke} />
    </svg>
  )
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3.4v17 M6 6.6h12 M6.2 6.8L3.4 13h5.6L6.2 6.8z M17.8 6.8L15 13h5.6l-2.8-6.2z M8 20.4h8" {...stroke} />
    </svg>
  )
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 11.6a3.8 3.8 0 100-7.6 3.8 3.8 0 000 7.6z M4.8 20.4c0-3.6 3.2-6 7.2-6s7.2 2.4 7.2 6" {...stroke} />
    </svg>
  )
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3l1.9 5.4L19.4 10l-5.5 1.6L12 17l-1.9-5.4L4.6 10l5.5-1.6L12 3z" {...stroke} />
    </svg>
  )
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M2.6 12S6 5.6 12 5.6 21.4 12 21.4 12 18 18.4 12 18.4 2.6 12 2.6 12z M12 14.7a2.7 2.7 0 100-5.4 2.7 2.7 0 000 5.4z" {...stroke} />
    </svg>
  )
}

export function DatabaseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 7.4c4.1 0 7.4-1.1 7.4-2.4S16.1 2.6 12 2.6 4.6 3.7 4.6 5 7.9 7.4 12 7.4z M19.4 5v14c0 1.3-3.3 2.4-7.4 2.4S4.6 20.3 4.6 19V5 M19.4 12c0 1.3-3.3 2.4-7.4 2.4S4.6 13.3 4.6 12" {...stroke} />
    </svg>
  )
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5.6 4.8h12.8c.7 0 1.2.6 1.2 1.2v13c0 .7-.5 1.2-1.2 1.2H5.6c-.6 0-1.2-.5-1.2-1.2V6c0-.6.6-1.2 1.2-1.2z M8.4 2.6v4 M15.6 2.6v4 M4.4 9.8h15.2" {...stroke} />
    </svg>
  )
}

export function HeadsetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4.6 14.4v-2.6a7.4 7.4 0 0114.8 0v2.6 M4.6 13.4h1.8c.6 0 1 .5 1 1v3.2c0 .6-.4 1-1 1H4.6c-.6 0-1-.4-1-1v-3.2c0-.5.4-1 1-1z M17.6 13.4h1.8c.6 0 1 .5 1 1v3.2c0 .6-.4 1-1 1h-1.8c-.5 0-1-.4-1-1v-3.2c0-.5.5-1 1-1z M19.4 18.6v.6a2.4 2.4 0 01-2.4 2.4h-2.6" {...stroke} />
    </svg>
  )
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4.4 5.4h15.2c.7 0 1.2.5 1.2 1.2v10.8c0 .7-.5 1.2-1.2 1.2H4.4c-.7 0-1.2-.5-1.2-1.2V6.6c0-.7.5-1.2 1.2-1.2z M3.6 6.6l8.4 5.8 8.4-5.8" {...stroke} />
    </svg>
  )
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4.6 12h14.8 M13.4 6l6 6-6 6" {...stroke} />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 9.4l6 6 6-6" {...stroke} />
    </svg>
  )
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3.6 10.2L12 3.6l8.4 6.6v9a1.2 1.2 0 01-1.2 1.2H4.8a1.2 1.2 0 01-1.2-1.2v-9z M9.4 20.4v-7h5.2v7" {...stroke} />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M11 18.4a7.4 7.4 0 100-14.8 7.4 7.4 0 000 14.8z M20.4 20.4l-4.2-4.2" {...stroke} />
    </svg>
  )
}

export function TicketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3.6 8.4V6.6c0-.7.5-1.2 1.2-1.2h14.4c.7 0 1.2.5 1.2 1.2v1.8a2.4 2.4 0 000 4.8v4.8c0 .7-.5 1.2-1.2 1.2H4.8c-.7 0-1.2-.5-1.2-1.2v-4.8a2.4 2.4 0 000-4.8z M14 5.4v13.2" {...stroke} />
    </svg>
  )
}

export function RouteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6.2 8.6a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z M17.8 20.6a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z M6.2 8.6v3.4a3 3 0 003 3h5.6a3 3 0 013 3" {...stroke} />
    </svg>
  )
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M14.4 6.6a3.8 3.8 0 005 5l-8.8 8.8a2.4 2.4 0 01-3.4-3.4l8.8-8.8-3.4-3.4a3.8 3.8 0 015 5" {...stroke} />
    </svg>
  )
}

export function TipIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9.4 18.4h5.2 M10.2 21h3.6 M12 2.8a6 6 0 00-3.4 11c.5.4.8 1 .8 1.6h5.2c0-.6.3-1.2.8-1.6A6 6 0 0012 2.8z" {...stroke} />
    </svg>
  )
}
