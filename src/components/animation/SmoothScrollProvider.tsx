'use client'

import { createContext, useContext, useEffect, useRef, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useMediaQuery } from '@/lib/use-media-query'
import { usePathname, useSearchParams } from 'next/navigation'

const LenisRefContext = createContext<React.RefObject<Lenis | null> | null>(null)

export function useLenis() {
  const ctx = useContext(LenisRefContext)
  if (!ctx) throw new Error('useLenis must be used within SmoothScrollProvider')
  return ctx
}

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

function LenisUrlListener({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const target = document.querySelector(hash) as HTMLElement | null
      if (!target) return

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -90, duration: 1.0 })
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }

    const timer = setTimeout(() => {
      lenisRef.current?.resize()
      ScrollTrigger.refresh()
      if (window.location.hash) {
        scrollToHash()
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, searchParams, lenisRef])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (!hash) return
      const target = document.querySelector(hash) as HTMLElement | null
      if (!target) return

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -90, duration: 1.0 })
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || !href.includes('#')) return

      try {
        const url = new URL(link.href, window.location.href)
        if (url.pathname === window.location.pathname && url.hash) {
          const target = document.querySelector(url.hash) as HTMLElement | null
          if (target) {
            e.preventDefault()
            window.history.pushState(null, '', url.hash)
            if (lenisRef.current) {
              lenisRef.current.scrollTo(target, { offset: -90, duration: 1.0 })
            } else {
              const top = target.getBoundingClientRect().top + window.scrollY - 90
              window.scrollTo({ top, behavior: 'smooth' })
            }
          }
        }
      } catch {
        // Safe ignore
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    document.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleClick)
    }
  }, [lenisRef])

  return null
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    // Force scroll to top (0, 0) on page load / refresh ONLY when there is no hash
    if (!window.location.hash) {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    const handleBeforeUnload = () => {
      if (!window.location.hash) {
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    gsap.registerPlugin(ScrollTrigger)

    // Lenis + GSAP official best practice: disable lagSmoothing for frame-lockstep sync
    gsap.ticker.lagSmoothing(0)

    if (isMobile === null) return

    // Mobile layout (< 768px) relies on native 60fps browser touch scrolling.
    if (isMobile) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      ScrollTrigger.refresh()
      return
    }

    // Desktop layout (> 768px): Instantiate Lenis smooth scroll
    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: (node: HTMLElement) =>
        node.closest('#qzvOverlay') !== null ||
        node.closest('[data-lenis-prevent]') !== null,
      syncTouch: false,
    })
    lenisRef.current = instance
    instance.scrollTo(window.scrollY || 0, { immediate: true })

    const updateFunc = (time: number) => {
      instance.raf(time * 1000)
    }

    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(updateFunc)

    // Instant/debounced window resize listener to trigger ScrollTrigger.refresh()
    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        instance.resize()
        ScrollTrigger.refresh()
      }, 100)
    }
    window.addEventListener('resize', handleResize)

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

    // ResizeObserver dynamically recalculates Lenis limits on accordion/DOM expansion with debounce
    let resizeObserver: ResizeObserver | null = null
    let roTimer: ReturnType<typeof setTimeout>
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(roTimer)
        roTimer = setTimeout(() => {
          instance.resize()
          ScrollTrigger.refresh()
        }, 150)
      })
      resizeObserver.observe(document.body)
    }

    ScrollTrigger.refresh()

    return () => {
      clearTimeout(resizeTimer)
      clearTimeout(roTimer)
      if (resizeObserver) resizeObserver.disconnect()
      gsap.ticker.remove(updateFunc)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeydown)
      instance.destroy()
      lenisRef.current = null
    }
  }, [isMobile])

  return (
    <LenisRefContext.Provider value={lenisRef}>
      <Suspense fallback={null}>
        <LenisUrlListener lenisRef={lenisRef} />
      </Suspense>
      {children}
    </LenisRefContext.Provider>
  )
}
