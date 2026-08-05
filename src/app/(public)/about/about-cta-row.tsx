'use client'

import { useOpenContactModal } from '@/components/layout/ContactModal'
import { useOpenExploreModal } from '@/components/layout/ExploreAppModal'

export function AboutHeroCta() {
  const openContactModal = useOpenContactModal()
  const openExploreModal = useOpenExploreModal()

  return (
    <div className="about-hero-actions">
      <button type="button" className="about-btn about-btn--primary" onClick={openContactModal}>
        Talk to Us
        <i className="fa-solid fa-arrow-right" />
      </button>
      <button type="button" className="about-btn about-btn--ghost" onClick={openExploreModal}>
        Explore iZhinga AI
      </button>
    </div>
  )
}

export function AboutFinalCta() {
  const openContactModal = useOpenContactModal()
  const openExploreModal = useOpenExploreModal()

  return (
    <div className="about-cta-actions">
      <button type="button" className="about-btn about-btn--primary" onClick={openContactModal}>
        Start Planning Now
      </button>
      <button type="button" className="about-btn about-btn--ghost" onClick={openExploreModal}>
        Explore the App
      </button>
    </div>
  )
}
