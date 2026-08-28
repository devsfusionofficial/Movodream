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
        Get in Touch
      </button>
      <button type="button" className="product-btn product-btn--outline" onClick={openExploreModal}>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ec2a8b] shadow-[0_0_8px_#ec2a8b] animate-pulse" />
          <span>Launching Soon</span>
          <span className="rounded-full bg-[#fce8f2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d71789]">Preview</span>
        </span>
      </button>
    </div>
  )
}
