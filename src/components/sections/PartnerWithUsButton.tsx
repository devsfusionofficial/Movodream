'use client'

import { useOpenContactModal } from '@/components/layout/ContactModal'

/**
 * The reference design's closing "Partner With Us" CTA. There's no separate
 * partnership form on this site, so it opens the same contact modal every
 * other CTA uses rather than inventing a new flow. Split into its own client
 * component so PartnersSection can stay an async server component.
 */
export function PartnerWithUsButton() {
  const openContactModal = useOpenContactModal()

  return (
    <button type="button" className="partners-cta-button" onClick={openContactModal}>
      {/* Both stars are drawn out to the edges of the viewBox — the earlier
          geometry sat in the middle half of it, so the icon rendered visibly
          smaller than its box and read as incidental next to the label. */}
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M10 2L12.1 7.9L18 10L12.1 12.1L10 18L7.9 12.1L2 10L7.9 7.9L10 2z" fill="currentColor" />
        <path
          d="M19 14L19.95 17.55L23.5 18.5L19.95 19.45L19 23L18.05 19.45L14.5 18.5L18.05 17.55L19 14z"
          fill="currentColor"
        />
      </svg>
      Partner With Us
    </button>
  )
}
