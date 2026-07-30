'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const LenisRefContext = createContext<React.RefObject<Lenis | null> | null>(null)

/**
 * Access the shared Lenis instance — e.g. the contact modal needs
 * lenis.stop()/start() while it's open. `.current` is null on mobile, where
 * the live site never instantiates Lenis at all (see below), and briefly
 * null on desktop before mount. A ref (not state) on purpose: consumers
 * only need the current instance at click/interaction time, not to
 * re-render when it initializes.
 */
export function useLenis() {
  const ctx = useContext(LenisRefContext)
  if (!ctx) throw new Error('useLenis must be used within SmoothScrollProvider')
  return ctx
}

/**
 * Ported 1:1 from the live site's script.js (lines 1–88). Two real
 * behaviors worth preserving exactly, not simplifying:
 *   - Lenis only runs on desktop (width > 768px). On mobile the live site
 *     uses ScrollTrigger.normalizeScroll instead — no Lenis at all there.
 *   - The contact modal (#qzvOverlay) is excluded from Lenis smoothing via
 *     `prevent`, so its own internal scroll isn't hijacked.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const isMobile = window.innerWidth <= 768

    if (!isMobile) {
      const instance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        prevent: (node: HTMLElement) => node.closest('#qzvOverlay') !== null,
        syncTouch: true,
      })
      lenisRef.current = instance

      let iframeTimeout: ReturnType<typeof setTimeout>
      const iframes = document.querySelectorAll('iframe')

      instance.on('scroll', () => {
        ScrollTrigger.update()

        iframes.forEach((iframe) => {
          if (iframe.style.pointerEvents !== 'none') iframe.style.pointerEvents = 'none'
        })

        clearTimeout(iframeTimeout)
        iframeTimeout = setTimeout(() => {
          iframes.forEach((iframe) => {
            iframe.style.pointerEvents = 'auto'
          })
        }, 150)
      })

      gsap.ticker.add((time) => instance.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (value !== undefined) {
            instance.scrollTo(value, { immediate: true })
          }
          return instance.scroll
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        },
        pinType: 'transform',
      })

      const handleKeydown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('input, textarea, select, [contenteditable]')) return

        const KEY_DELTA: Record<string, number> = {
          ArrowDown: 150,
          ArrowUp: -150,
          PageDown: window.innerHeight * 0.8,
          PageUp: -(window.innerHeight * 0.8),
          ' ': e.shiftKey ? -(window.innerHeight * 0.8) : window.innerHeight * 0.8,
        }
        const delta = KEY_DELTA[e.key]
        if (delta === undefined) return
        e.preventDefault()
        instance.scrollTo(instance.scroll + delta)
      }
      document.addEventListener('keydown', handleKeydown, { passive: false })

      return () => {
        document.removeEventListener('keydown', handleKeydown)
        instance.destroy()
        lenisRef.current = null
      }
    }

    ScrollTrigger.normalizeScroll({ allowNestedScroll: true })
  }, [])

  return <LenisRefContext.Provider value={lenisRef}>{children}</LenisRefContext.Provider>
}
