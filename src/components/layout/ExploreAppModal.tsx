'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Image from 'next/image'

const ExploreModalContext = createContext<(() => void) | null>(null)

/** Any component (Hero's "Explore Platform" CTA, etc.) can open the modal. */
export function useOpenExploreModal() {
  const open = useContext(ExploreModalContext)
  if (!open) throw new Error('useOpenExploreModal must be used within ExploreAppModalProvider')
  return open
}

/**
 * Ported from index.html's #exploreModal markup + script.js lines 2273–2307:
 * open/close on button click, close on overlay click or Escape, and locks
 * body scroll while open.
 */
export function ExploreAppModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  return (
    <ExploreModalContext.Provider value={open}>
      {children}
      <div
        className={`explore-modal-overlay${isOpen ? ' active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="explore-modal">
          <button type="button" className="explore-modal-close" onClick={close} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>

          <div className="explore-modal-content">
            <div className="explore-modal-header">
              <Image src="/assets/images/logo.png" alt="" width={60} height={60} className="explore-modal-logo" />
              <h2>Choose Platform</h2>
              <p>Select your device</p>
            </div>

            <div className="explore-modal-options">
              <a href="#" className="explore-option ios-option">
                <div className="explore-option-icon">
                  <i className="fa-brands fa-apple" />
                </div>
                <div className="explore-option-text">
                  <span className="explore-option-name">iOS</span>
                  <span className="explore-option-sub">App Store</span>
                </div>
                <i className="fa-solid fa-chevron-right explore-option-arrow" />
              </a>

              <a href="#" className="explore-option android-option">
                <div className="explore-option-icon">
                  <i className="fa-brands fa-android" />
                </div>
                <div className="explore-option-text">
                  <span className="explore-option-name">Android</span>
                  <span className="explore-option-sub">Google Play</span>
                </div>
                <i className="fa-solid fa-chevron-right explore-option-arrow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </ExploreModalContext.Provider>
  )
}
