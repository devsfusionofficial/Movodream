'use client'

import dynamic from 'next/dynamic'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MarqueeTicker } from './clarity/MarqueeTicker'

// Heavy (three.js + GLTF model) — dynamically imported with ssr:false per
// the architecture doc's plan; PhoneScene itself further gates the actual
// model fetch behind an IntersectionObserver, so this only costs bundle
// size, not an eager network/GPU cost.
const PhoneScene = dynamic(() => import('./clarity/PhoneScene').then((m) => m.PhoneScene), { ssr: false })

/**
 * Ported from index.html's section-3 + script.js lines 1164–1365:
 *  - s3-heading: char-split 3D-flip entrance (once, on scroll-in) plus a
 *    separate scrubbed horizontal drift tied to scroll position.
 *  - phone-text: two lines drift in opposite directions, scrubbed.
 *  - s3-right: live-badge/title/desc cascade, split by words (desktop) or
 *    lines (mobile) since word-splitting a long heading on a narrow mobile
 *    screen looks worse than the original intended.
 */
export function ClarityIntel() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const splits: SplitText[] = []
    const mm = gsap.matchMedia()

    // ── DESKTOP (> 768px): Full entrance & scroll-tied animations ──
    mm.add('(min-width: 769px)', () => {
      const splitS3Heading = SplitText.create('.s3-heading', { type: 'chars,words' })
      splits.push(splitS3Heading)

      gsap.fromTo(
        splitS3Heading.chars,
        { y: 60, autoAlpha: 0 },
        {
          duration: 0.9,
          y: 0,
          autoAlpha: 1,
          transformOrigin: '50% 100%',
          stagger: { each: 0.04, ease: 'power2.in' },
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.section-3',
            start: 'top 85%',
            toggleActions: 'play none play reverse',
          },
        }
      )

      gsap.fromTo(
        '.s3-heading',
        { x: '4.5vw' },
        {
          x: '-2.5vw',
          ease: 'none',
          scrollTrigger: {
            trigger: '.section-3',
            start: 'top 100%',
            end: 'bottom 15%',
            scrub: 1,
          },
        }
      )

      const phoneText = document.querySelector('.phone-text')
      if (phoneText) {
        const lines = phoneText.querySelectorAll('span')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.section-3', start: 'top 75%', scrub: true },
        })
        tl.fromTo(lines[0], { x: '12%' }, { x: '-12%', duration: 1.1, ease: 'power3.out' })
        tl.fromTo(lines[1], { x: '-12%' }, { x: '12%', duration: 1.1, ease: 'power3.out' }, '-=0.75')
      }

      const s3Right = document.querySelector('.s3-right')
      if (s3Right) {
        const liveBadge = s3Right.querySelector('.live-badge')
        const title = s3Right.querySelector<HTMLElement>('.s3-title')
        const descMain = s3Right.querySelector('.s3-desc-main')
        const descSub = s3Right.querySelector('.s3-desc-sub')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.s3-right',
            start: 'top 75%',
            toggleActions: 'play none play reverse',
          },
        })

        if (liveBadge) {
          tl.fromTo(liveBadge, { scale: 0.6, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
        }

        if (title) {
          gsap.set(title, { perspective: 800 })
          const splitTitle = SplitText.create(title, { type: 'words' })
          splits.push(splitTitle)
          tl.fromTo(
            splitTitle.words,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: { each: 0.06, from: 'start' } },
            '-=0.4'
          )
        }

        if (descMain) {
          const splitMain = SplitText.create(descMain, { type: 'lines' })
          splits.push(splitMain)
          tl.fromTo(
            splitMain.lines,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: { each: 0.12 } },
            '-=0.7'
          )
        }

        if (descSub) {
          tl.fromTo(descSub, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        }
      }
    })

    // ── MOBILE & SMALL DEVICES (<= 768px): Completely static text, zero animation ──
    mm.add('(max-width: 768px)', () => {
      const s3Right = document.querySelector('.s3-right')
      if (s3Right) {
        const title = s3Right.querySelector<HTMLElement>('.s3-title')
        const descMain = s3Right.querySelector<HTMLElement>('.s3-desc-main')
        const descSub = s3Right.querySelector<HTMLElement>('.s3-desc-sub')

        if (title) {
          gsap.killTweensOf(title)
          gsap.set(title, { opacity: 1, y: 0, yPercent: 0, clearProps: 'all' })
        }
        if (descMain) {
          gsap.killTweensOf(descMain)
          gsap.set(descMain, { opacity: 1, y: 0, clearProps: 'all' })
        }
        if (descSub) {
          gsap.killTweensOf(descSub)
          gsap.set(descSub, { opacity: 1, y: 0, clearProps: 'all' })
        }
      }

      const splitS3HeadingMobile = SplitText.create('.s3-heading', { type: 'chars,words' })
      splits.push(splitS3HeadingMobile)

      gsap.fromTo(
        splitS3HeadingMobile.chars,
        { y: 30, opacity: 0 },
        {
          duration: 0.75,
          y: 0,
          opacity: 1,
          transformOrigin: '50% 100%',
          stagger: { each: 0.03, ease: 'power2.in' },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.s3-heading',
            start: 'top 92%',
            toggleActions: 'play none play reverse',
            invalidateOnRefresh: true,
          },
        }
      )
    })

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      mm.revert()
      splits.forEach((s: SplitText) => s.revert())
    }
  }, [])

  return (
    <section id="vision" className="section-3">
      <h2 className="s3-heading">
        <span className="s3-pink block sm:inline">Clarity Through</span>{' '}
        <span className="s3-purple block sm:inline">Intelligence</span>
      </h2>

      <div className="s3-body">
        <div className="s3-left">
          <div className="phone-glow" />
          <h2 className="phone-text">
            <span>Travel Shouldn&apos;t</span>
            <span>Be Overwhelming</span>
          </h2>
          <div className="phone-wrap">
            {/* Instant high-performance poster (11.5 KB) rendered immediately to eliminate 2-4s delay */}
            <img
              src="/assets/images/phone-poster.webp"
              alt="Movodream AI Travel Phone"
              className="phone-poster-img"
              loading="eager"
              decoding="async"
              width={400}
              height={800}
            />
            <PhoneScene />
          </div>
        </div>

        <div className="s3-right">
          <h2 className="s3-title">
            Flight delays, Wrong turns, Overpriced tourist food, Travel is full of friction. We remove it!
          </h2>
          <p className="s3-desc-main">
            We cut through decision fatigue by bringing clarity to planning—delivering sharply personalized
            recommendations aligned with your preferences, so every choice feels obvious.
          </p>
          <p className="s3-desc-sub">Ensures every journey feels effortless, seamless, and personalized.</p>
        </div>
      </div>

      <MarqueeTicker />
    </section>
  )
}
