'use client'

import { useOpenContactModal } from '@/components/layout/ContactModal'
import { ArrowRightIcon, HeadsetIcon } from './icons'

/**
 * Sidebar help card. Client component only so the primary action can open
 * the site-wide contact modal, the same flow every other CTA uses.
 */
export function DocHelpCard() {
  const openContactModal = useOpenContactModal()

  return (
    <div className="doc-card doc-help">
      <h2>Need help?</h2>
      <p>Our support team is here to help you with any questions.</p>
      <div className="doc-actions">
        <button type="button" className="doc-btn doc-btn-primary" onClick={openContactModal}>
          Contact Support
          <HeadsetIcon />
        </button>
        <a className="doc-btn doc-btn-ghost" href="/support">
          View Help Center
          <ArrowRightIcon />
        </a>
      </div>
    </div>
  )
}
