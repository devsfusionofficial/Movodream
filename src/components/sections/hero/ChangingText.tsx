'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CHANGING_TEXTS = ['AI Precision', 'AI Innovation', 'Authentic Expertise', 'Immersive Experience']
const CHAR_DURATION = 0.38
const HOLD_DURATION = 3500

const isLowEndDevice = () => {
  const isMobile = window.innerWidth <= 768
  const nav = navigator as Navigator & { deviceMemory?: number }
  const lowEndRAM = nav.deviceMemory !== undefined && nav.deviceMemory <= 2
  const lowEndCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  const isVeryLowEnd =
    navigator.maxTouchPoints > 0 && ((nav.deviceMemory ?? 99) <= 1 || navigator.hardwareConcurrency <= 2)
  return (isMobile && (lowEndRAM || lowEndCPU)) || isVeryLowEnd
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Ported 1:1 from script.js lines 89–184: builds per-letter spans, animates
 * them in/out, cycles through the 4 phrases forever. Runs as an async loop
 * (not a GSAP-repeat timeline) to match the original's structure exactly —
 * `cancelled` guards every await so nothing touches the DOM after unmount.
 */
export function ChangingText() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    const charStagger = isLowEndDevice() ? 0.02 : 0.03

    function buildChars(text: string) {
      el!.innerHTML = ''
      const allSpans: HTMLSpanElement[] = []

      text.split(' ').forEach((word, wordIndex, arr) => {
        const wordSpan = document.createElement('span')
        wordSpan.style.display = 'inline-block'
        wordSpan.style.whiteSpace = 'nowrap'

        word.split('').forEach((char) => {
          const span = document.createElement('span')
          span.style.display = 'inline-block'
          span.style.opacity = '0'
          span.textContent = char
          wordSpan.appendChild(span)
          allSpans.push(span)
        })

        el!.appendChild(wordSpan)
        if (wordIndex < arr.length - 1) el!.appendChild(document.createTextNode(' '))
      })

      return allSpans
    }

    function animateIn(chars: HTMLSpanElement[]) {
      return new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve })
        gsap.set(chars, { opacity: 0, xPercent: 45 })
        tl.to(chars, { opacity: 1, xPercent: 0, duration: CHAR_DURATION, ease: 'power2.out', stagger: charStagger })
      })
    }

    function animateOut(chars: HTMLSpanElement[]) {
      return new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve })
        tl.to([...chars].reverse(), { opacity: 0, xPercent: -45, duration: 0.22, ease: 'power2.in', stagger: 0.025 })
      })
    }

    async function runLoop() {
      let index = 0
      let chars = buildChars(CHANGING_TEXTS[0])
      await animateIn(chars)

      while (!cancelled) {
        await sleep(HOLD_DURATION)
        if (cancelled) return
        await animateOut(chars)
        if (cancelled) return
        await sleep(120)
        if (cancelled) return

        index = (index + 1) % CHANGING_TEXTS.length
        chars = buildChars(CHANGING_TEXTS[index])
        await animateIn(chars)
      }
    }

    const timeout = setTimeout(runLoop, 1500)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  return <span ref={ref} className="changing-text" style={{ display: 'inline' }} />
}
