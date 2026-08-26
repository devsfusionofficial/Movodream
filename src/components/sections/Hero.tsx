'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useOpenContactModal } from '@/components/layout/ContactModal'
import { ChangingText } from './hero/ChangingText'
import { HeroCards } from './hero/HeroCards'

/**
 * Headline splits into lines/chars with a per-line staggered reveal,
 * then desc/CTAs cascade in relative to when the headline finishes.
 * Uses a font-load race fallback (max 80ms) so text renders instantly
 * on slow mobile/laptop connections without a blank screen.
 */
export function Hero() {
  const openContactModal = useOpenContactModal()

  useGSAP(() => {
    const headline = document.querySelector<HTMLElement>('.hero-left h1')
    if (!headline) return

    let splitAll: SplitText | null = null
    let splitDesc: SplitText | null = null
    let cancelled = false

    // Race font readiness with a fast timeout (80ms) so users on slow networks
    // immediately see the content without waiting 3-5 seconds for fonts.
    const fontCheck = 'fonts' in document
      ? Promise.race([document.fonts.ready, new Promise((res) => setTimeout(res, 80))])
      : Promise.resolve()

    fontCheck.then(() => {
      if (cancelled) return

      try {
        splitAll = SplitText.create(headline, { type: 'lines,chars', linesClass: 'split-hero-line' })
        gsap.set('.split-hero-line', { overflow: 'hidden' })
        gsap.set(headline, { opacity: 1 })
        gsap.set(splitAll.chars, { opacity: 0, xPercent: 45 })

        const master = gsap.timeline({ delay: 0.04 })
        const CHAR_STAGGER = 0.035
        const LINE_GAP = 0.08
        let timeOffset = 0

        splitAll.lines.forEach((line) => {
          const chars = splitAll!.chars.filter((char) => line.contains(char))
          chars.forEach((char, i) => {
            master.fromTo(
              char,
              { opacity: 0, xPercent: 45 },
              { opacity: 1, xPercent: 0, duration: 0.35, ease: 'power2.out' },
              timeOffset + i * CHAR_STAGGER
            )
          })
          timeOffset += chars.length * CHAR_STAGGER + LINE_GAP
        })

        const desc = document.querySelector<HTMLElement>('.hero-left .desc')
        const ctas = document.querySelectorAll<HTMLElement>('.hero-ctas > div')

        if (desc) {
          splitDesc = SplitText.create(desc, { type: 'words' })
          gsap.set(splitDesc.words, { opacity: 0, y: 14 })
          master.to(
            splitDesc.words,
            { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out', stagger: { each: 0.025, from: 'start' } },
            timeOffset - 0.05
          )
        }

        if (ctas.length > 0) {
          gsap.set([...ctas], { opacity: 0, y: 20 })
          master.to(
            [...ctas],
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.1 },
            timeOffset + 0.15
          )
        }
      } catch {
        // Safe fallback: ensure all content is fully visible if SplitText fails
        gsap.set(headline, { opacity: 1 })
        const desc = document.querySelector<HTMLElement>('.hero-left .desc')
        const ctas = document.querySelectorAll<HTMLElement>('.hero-ctas > div')
        if (desc) gsap.set(desc, { opacity: 1 })
        if (ctas.length > 0) gsap.set([...ctas], { opacity: 1, y: 0 })
      }
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
        <h1>
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
