'use client'

import { useOpenContactModal } from '@/components/layout/ContactModal'
import { useOpenExploreModal } from '@/components/layout/ExploreAppModal'

// Both CTAs route to flows that already exist site-wide: the contact modal
// and the iOS/Android chooser. No new "watch demo" video exists yet, so the
// secondary hero button opens the contact modal rather than a dead link.
export function ProductHeroCta() {
  const openExploreModal = useOpenExploreModal()
  const openContactModal = useOpenContactModal()

  return (
    <div className="product-hero-actions">
      <button type="button" className="product-btn product-btn--primary" onClick={openExploreModal}>
        Explore iZhinga AI
        <i className="fa-solid fa-arrow-right" />
      </button>
      <button type="button" className="product-btn product-btn--ghost" onClick={openContactModal}>
        <i className="fa-solid fa-play" />
        Request a Demo
      </button>
    </div>
  )
}

export function ProductFinalCta() {
  const openContactModal = useOpenContactModal()
  const openExploreModal = useOpenExploreModal()

  return (
    <div className="product-final-actions">
      <button type="button" className="product-btn product-btn--light" onClick={openContactModal}>
        Start Planning Now
      </button>
      <button type="button" className="product-btn product-btn--outline" onClick={openExploreModal}>
        Download App
        <i className="fa-solid fa-download" />
      </button>
    </div>
  )
}
