'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CHANGING_TEXTS = [
  'AI Precision',
  'AI Innovation',
  'Authentic Expertise',
  'Immersive Experience',
]

const CHAR_STAGGER = 0.03
const CHAR_DURATION = 0.38
const HOLD_DURATION = 3500
const OUT_DURATION = 0.22
const OUT_STAGGER = 0.025
const PAUSE_BETWEEN = 120

export function ChangingText() {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let isCancelled = false
    let currentTimeline: gsap.core.Timeline | null = null
    let currentTextIndex = 0

    const rootEl = el

    // Clear SSR text immediately on client mount so SplitText in Hero.tsx
    // sees an empty container and never touches or corrupts the dynamic text nodes.
    rootEl.innerHTML = ''

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          if (!isCancelled) resolve()
        }, ms)
      })

    function buildChars(text: string): HTMLSpanElement[] {
      rootEl.innerHTML = ''
      const allSpans: HTMLSpanElement[] = []

      text.split(' ').forEach((word, wordIndex, arr) => {
        const wordSpan = document.createElement('span')
        wordSpan.style.display = 'inline-block'
        wordSpan.style.whiteSpace = 'nowrap'

        word.split('').forEach((char) => {
          const charSpan = document.createElement('span')
          charSpan.style.display = 'inline-block'
          charSpan.style.opacity = '0'
          charSpan.textContent = char
          wordSpan.appendChild(charSpan)
          allSpans.push(charSpan)
        })

        rootEl.appendChild(wordSpan)

        if (wordIndex < arr.length - 1) {
          rootEl.appendChild(document.createTextNode(' '))
        }
      })

      return allSpans
    }

    function animateIn(chars: HTMLSpanElement[]): Promise<void> {
      return new Promise<void>((resolve) => {
        if (isCancelled) return resolve()
        currentTimeline = gsap.timeline({ onComplete: resolve })
        gsap.set(chars, { opacity: 0, xPercent: 45 })
        currentTimeline.to(chars, {
          opacity: 1,
          xPercent: 0,
          duration: CHAR_DURATION,
          ease: 'power2.out',
          stagger: CHAR_STAGGER,
        })
      })
    }

    function animateOut(chars: HTMLSpanElement[]): Promise<void> {
      return new Promise<void>((resolve) => {
        if (isCancelled) return resolve()
        currentTimeline = gsap.timeline({ onComplete: resolve })
        currentTimeline.to([...chars].reverse(), {
          opacity: 0,
          xPercent: -45,
          duration: OUT_DURATION,
          ease: 'power2.in',
          stagger: OUT_STAGGER,
        })
      })
    }

    async function runLoop() {
      // Delay before starting the loop so the headline text ("Building the Future of Travel With")
      // completes its initial entrance animation first (~1.35s).
      await sleep(1500)
      if (isCancelled) return

      let chars = buildChars(CHANGING_TEXTS[0])
      await animateIn(chars)

      while (!isCancelled) {
        await sleep(HOLD_DURATION)
        if (isCancelled) break
        await animateOut(chars)
        if (isCancelled) break
        await sleep(PAUSE_BETWEEN)
        if (isCancelled) break

        currentTextIndex = (currentTextIndex + 1) % CHANGING_TEXTS.length
        chars = buildChars(CHANGING_TEXTS[currentTextIndex])
        await animateIn(chars)
      }
    }

    runLoop()

    return () => {
      isCancelled = true
      currentTimeline?.kill()
      rootEl.innerHTML = ''
    }
  }, [])

  return (
    <span ref={containerRef} className="changing-text" suppressHydrationWarning>
      AI Precision
    </span>
  )
}
