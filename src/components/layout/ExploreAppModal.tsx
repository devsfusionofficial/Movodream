'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
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
            <div className="explore-modal-header !mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#21182a] !mb-0">
                Launching Soon
              </h2>
            </div>

            <div className="explore-modal-options">
              <div className="explore-option android-option cursor-default !bg-gradient-to-r !from-[#282b34] !to-[#393e4b] border border-[#4a5061]/25 text-white shadow-[0_4px_16px_rgba(40,43,52,0.18)]">
                <div className="explore-option-icon">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 29 32" className="w-[22px] h-[24px] ml-0.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.54 15.28.12 29.34a3.64 3.64 0 0 0 5.33 2.16l15.1-8.6z" fill="#EA4335" />
                      <path d="m27.11 12.89-6.53-3.74-7.35 6.45 7.38 7.28 6.48-3.7a3.55 3.55 0 0 0 0-6.29z" fill="#FBBC04" />
                      <path d="M.12 2.66a3.46 3.46 0 0 0-.12.92v24.84a3.66 3.66 0 0 0 .12.92L14 15.64Z" fill="#4285F4" />
                      <path d="m13.64 16 6.94-6.85L5.5.51A3.72 3.72 0 0 0 3.63 0 3.64 3.64 0 0 0 .12 2.65Z" fill="#34A853" />
                    </svg>
                  </div>
                </div>
                <div className="explore-option-text">
                  <span className="explore-option-name text-white">Google Play</span>
                  <span className="explore-option-sub text-slate-300">Android App Store</span>
                </div>
                <span className="rounded-full bg-white/15 border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
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

