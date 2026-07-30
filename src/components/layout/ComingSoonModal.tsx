'use client'

import { useEffect } from 'react'
import Image from 'next/image'

/**
 * Ported from footer.js's `comingSoonHTML` (injected on load, opened by the
 * footer's social icons). Deliberately reuses ExploreAppModal's
 * `.explore-modal-*` classes — the original site does the same instead of
 * defining its own modal styles.
 */
export function ComingSoonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  return (
    <div
      className={`explore-modal-overlay${open ? ' active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="explore-modal">
        <button type="button" className="explore-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="explore-modal-content">
          <div className="explore-modal-header">
            <Image
              src="/assets/images/logo.png"
              alt=""
              width={50}
              height={35}
              className="explore-modal-logo"
              style={{ width: 50, marginBottom: 15 }}
            />
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Coming Soon!</h2>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              type="button"
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
              style={{
                background: 'var(--accent, #d11b4c)',
                color: 'white',
                border: 'none',
                padding: '10px 30px',
                borderRadius: 999,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
