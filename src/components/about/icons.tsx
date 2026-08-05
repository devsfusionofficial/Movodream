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

export function TabsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M3.6 6.8c0-.7.5-1.2 1.2-1.2h5.6l1.6 1.8h7.4c.7 0 1.2.5 1.2 1.2v9.6c0 .7-.5 1.2-1.2 1.2H4.8c-.7 0-1.2-.5-1.2-1.2V6.8z"
        {...stroke}
      />
    </svg>
  )
}

export function ConfusionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 15.4v-.6c0-1.2 1.1-1.7 1.9-2.4.8-.7 1.3-1.4 1.3-2.4a3.2 3.2 0 00-6.4-.2 M12 18.6v.1"
        {...stroke}
      />
    </svg>
  )
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

export function PuzzleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M9 4.6h3.4a1.4 1.4 0 011.4 1.6 1.6 1.6 0 000 3.2h1.6a1.4 1.4 0 011.4 1.4V14a1.4 1.4 0 01-1.6 1.4 1.6 1.6 0 000 3.2 1.4 1.4 0 011.4 1.4v.6H6a1.4 1.4 0 01-1.4-1.4v-4.8a1.6 1.6 0 013.2 0A1.4 1.4 0 019.8 15H9a1.4 1.4 0 01-1.4-1.4V6a1.4 1.4 0 011.4-1.4z"
        {...stroke}
      />
    </svg>
  )
}

export function BrainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M9.6 4.4a2.6 2.6 0 00-2.6 2.6c0 .3 0 .6.1.9A2.8 2.8 0 006 12.8c-.1.3-.2.7-.2 1a2.8 2.8 0 002.8 2.8 2.6 2.6 0 002.6-2.4V6.8a2.4 2.4 0 00-1.6-2.4z M14.4 4.4a2.6 2.6 0 012.6 2.6c0 .3 0 .6-.1.9A2.8 2.8 0 0118 12.8c.1.3.2.7.2 1a2.8 2.8 0 01-2.8 2.8 2.6 2.6 0 01-2.6-2.4V6.8a2.4 2.4 0 011.6-2.4z"
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

export function BookmarkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6.6 4.6h10.8c.4 0 .8.4.8.8v14L12 15.6l-6.2 3.8v-14c0-.4.4-.8.8-.8z" {...stroke} />
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

export function DiscoverIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.4a8.4 8.4 0 100-16.8 8.4 8.4 0 000 16.8z M9.2 9.2l2.2 2.8 2.2-2.8M9.2 14.8l2.2-2.8 2.2 2.8"
        {...stroke}
      />
    </svg>
  )
}

export function GalleryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4.8 4.8h14.4c.7 0 1.2.5 1.2 1.2v12c0 .7-.5 1.2-1.2 1.2H4.8c-.7 0-1.2-.5-1.2-1.2V6c0-.7.5-1.2 1.2-1.2z M8.4 10a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z M20.4 15.6l-5-4.8-4 3.6-2.4-2-5 4.6"
        {...stroke}
      />
    </svg>
  )
}

export function SuitcaseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4.8 8.4h14.4c.7 0 1.2.5 1.2 1.2v9.2c0 .7-.5 1.2-1.2 1.2H4.8c-.7 0-1.2-.5-1.2-1.2V9.6c0-.7.5-1.2 1.2-1.2z M9 8.4V6a1.2 1.2 0 011.2-1.2h3.6A1.2 1.2 0 0115 6v2.4 M3.6 13.6h16.8"
        {...stroke}
      />
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

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5.6 20.4V5.6c0-.7.5-1.2 1.2-1.2h10.4c.7 0 1.2.5 1.2 1.2v14.8 M8.4 8h2M8.4 11.6h2M8.4 15.2h2M13.6 8h2M13.6 11.6h2M13.6 15.2h2M3.6 20.4h16.8"
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

export function BulbIdeaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M9.4 18.4h5.2 M10.2 21h3.6 M12 2.8a6 6 0 00-3.4 11c.5.4.8 1 .8 1.6h5.2c0-.6.3-1.2.8-1.6A6 6 0 0012 2.8z"
        {...stroke}
      />
    </svg>
  )
}

export function RocketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M14.6 9.4c1.8-1.8 4.4-2.6 6-2.8-.2 1.6-1 4.2-2.8 6l-8.4 8.4-4.8 1.2 1.2-4.8 8.8-8z M9.4 14.6L5 19M9.6 6.8a3 3 0 013-3M6.8 9.6a3 3 0 01-3 3"
        {...stroke}
      />
    </svg>
  )
}

export function ExpandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M3.6 9.6V5.4a1.2 1.2 0 011.2-1.2h4.2 M14.8 4.2H19a1.2 1.2 0 011.2 1.2v4.2 M20.2 14.4v4.2A1.2 1.2 0 0119 19.8h-4.2 M9.2 19.8H5A1.2 1.2 0 013.8 18.6v-4.2"
        {...stroke}
      />
    </svg>
  )
}
