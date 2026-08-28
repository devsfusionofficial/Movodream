'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useOpenContactModal } from '@/components/layout/ContactModal'

const ExploreModalContext = createContext<(() => void) | null>(null)

export function useOpenExploreModal() {
  const open = useContext(ExploreModalContext)
  if (!open) throw new Error('useOpenExploreModal must be used within ExploreAppModalProvider')
  return open
}

export function ExploreAppModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openContactModal = useOpenContactModal()

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

  const handleJoinEarlyAccess = () => {
    close()
    openContactModal()
  }

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
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#ff7294]/30 bg-[#fce8f2] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d71789]">
                <Sparkles className="h-3 w-3 text-[#d71789]" />
                Private Preview
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#21182a]">
                Launching Soon
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#7a7180]">
                <strong>iZhinga AI</strong> is being crafted for iOS & Android to deliver intelligent trip planning, real-time assistance, and personalized recommendations.
              </p>
            </div>

            <div className="explore-modal-options">
              <div className="explore-option ios-option cursor-default">
                <div className="explore-option-icon">
                  <i className="fa-brands fa-apple" />
                </div>
                <div className="explore-option-text">
                  <span className="explore-option-name">iOS</span>
                  <span className="explore-option-sub">Apple App Store</span>
                </div>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff9ec6]">
                  Coming Soon
                </span>
              </div>

              <div className="explore-option android-option cursor-default">
                <div className="explore-option-icon">
                  <i className="fa-brands fa-android" />
                </div>
                <div className="explore-option-text">
                  <span className="explore-option-name">Android</span>
                  <span className="explore-option-sub">Google Play Store</span>
                </div>
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Coming Soon
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#eee6ef] text-center">
              <button
                type="button"
                onClick={handleJoinEarlyAccess}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d71789] to-[#ff7294] py-3 px-4 text-xs font-bold text-white shadow-[0_8px_20px_rgba(215,23,137,0.25)] transition hover:opacity-95 cursor-pointer"
              >
                <span>Get Early Access Updates</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ExploreModalContext.Provider>
  )
}
