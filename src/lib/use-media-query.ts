'use client'

import { useSyncExternalStore } from 'react'

/**
 * Live media-query subscription. Returns null on the very first client
 * render (before any browser API has been consulted), then the real
 * boolean once mounted.
 *
 * Not a useState+useEffect combo: an effect that calls setState with the
 * current matchMedia value on every mount trips React's "don't call
 * setState synchronously in an effect" lint rule, and more importantly,
 * useSyncExternalStore is the primitive actually designed for subscribing
 * to state that lives outside React (the browser's viewport), so resize
 * events are picked up without an extra render-then-correct cycle.
 *
 * Extracted after finding the same one-time `window.innerWidth` read
 * duplicated across several components (HeroCards, ImmersiveBooking, …).
 * Reading it once at mount and never again means a component that first
 * renders at desktop width stays locked onto desktop behavior even after
 * the viewport is resized down without a page reload — exactly what
 * DevTools' responsive-mode toggle does, and exactly what those components
 * were silently getting wrong.
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => null
  )
}
