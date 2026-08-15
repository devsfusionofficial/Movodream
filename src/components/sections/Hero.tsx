'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useOpenContactModal } from '@/components/layout/ContactModal'
import { ChangingText } from './hero/ChangingText'
import { HeroCards } from './hero/HeroCards'

/**
 * Ported from script.js lines 840–907: headline splits into lines/chars
 * with a per-line staggered reveal, then desc/CTAs cascade in relative to
 * when the headline finishes (`timeOffset`) — not a fixed delay, so the
 * pacing self-adjusts to however many lines the headline wraps to.
 */
export function Hero() {
  const openContactModal = useOpenContactModal()

  useGSAP(() => {
    const headline = document.querySelector<HTMLElement>('.hero-left h1')
    if (!headline) return

    let splitAll: SplitText | null = null
    let splitDesc: SplitText | null = null
    let cancelled = false

    // The headline starts at opacity:0 (inline style in the JSX below) and
    // only becomes visible once this runs — if SplitText splits into
    // lines/chars before the real webfont has loaded, it measures against
    // the fallback font's metrics. The browser then reflows once the real
    // font swaps in, but the split (and the char positions/timeline built
    // from it) doesn't recompute — on a slow/cold-cache load this is common
    // enough to be the likely cause of the hero occasionally staying blank
    // after a hard refresh. Waiting for fonts.ready first means the split
    // is always measured against final layout.
    document.fonts.ready.then(() => {
      if (cancelled) return

      splitAll = SplitText.create(headline, { type: 'lines,chars', linesClass: 'split-hero-line' })
      gsap.set('.split-hero-line', { overflow: 'hidden' })
      gsap.set(headline, { opacity: 1 })
      gsap.set(splitAll.chars, { opacity: 0, xPercent: 45 })

      const master = gsap.timeline({ delay: 0.05 })
      const CHAR_STAGGER = 0.038
      const LINE_GAP = 0.1
      let timeOffset = 0

      splitAll.lines.forEach((line) => {
        const chars = splitAll!.chars.filter((char) => line.contains(char))
        chars.forEach((char, i) => {
          master.fromTo(
            char,
            { opacity: 0, xPercent: 45 },
            { opacity: 1, xPercent: 0, duration: 0.38, ease: 'power2.out' },
            timeOffset + i * CHAR_STAGGER
          )
        })
        timeOffset += chars.length * CHAR_STAGGER + LINE_GAP
      })

      const desc = document.querySelector<HTMLElement>('.hero-left .desc')
      const ctas = document.querySelectorAll<HTMLElement>('.hero-ctas > div')

      gsap.set([...ctas], { opacity: 0 })

      if (desc) {
        splitDesc = SplitText.create(desc, { type: 'words' })
        gsap.set(splitDesc.words, { opacity: 0, y: 14 })
        master.to(
          splitDesc.words,
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: { each: 0.03, from: 'start' } },
          timeOffset - 0.05
        )
      }

      master.fromTo(
        [...ctas],
        { opacity: 0, y: 28, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.4)', stagger: 0.1 },
        timeOffset + 0.18
      )
    })

    return () => {
      cancelled = true
      splitAll?.revert()
      splitDesc?.revert()
    }
  }, [])

  return (
    <div className="hero-section">
      <div className="hero-left">
        <h1 style={{ opacity: 0 }}>
          Building the{' '}
          <svg width="1em" height="1em" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.625 26.5C20.4668 26.5 26.5 20.6766 26.5 6.625C26.5 20.6766 32.4912 26.5 46.375 26.5C32.4912 26.5 26.5 32.4912 26.5 46.375C26.5 32.4912 20.4668 26.5 6.625 26.5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="3.375"
              strokeLinejoin="round"
            />
          </svg>
          <br />
          Future of Travel <br />
          With <ChangingText />
        </h1>
        <div className="desc">
          <p>
            We are an AI-first technology company, building the foundational intelligence for next-generation
            journeys. Our platform unify fragmented data streams into seamless, context-aware travel experiences.
          </p>
          <p style={{ paddingTop: 6, paddingBottom: 6 }}>
            Movodream plans, books, and guides your entire travel. A global network of local experts verifies every
            place you visit. No guesswork. No bad meals. No lost hours.
          </p>
          <p>
            <strong style={{ fontSize: '0.8em', color: '#0181FF' }}>
              360° previews. AR/VR navigation. Live real-time guidance. All in one place.
            </strong>
          </p>
        </div>
        <div className="hero-ctas">
          <div className="demo-anim atropos">
            <div className="atropos-scale">
              <div className="atropos-rotate">
                <div className="atropos-inner">
                  <button type="button" className="demo-btn qzv-launcher" onClick={openContactModal}>
                    Start Your Journey
                    <i style={{ transform: 'translateY(16%)' }} className="fa-solid fa-angle-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <HeroCards />
      </div>
    </div>
  )
}
