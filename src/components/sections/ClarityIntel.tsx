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

    let cancelled = false
    const splits: SplitText[] = []

    // SplitText measures line/word/char boxes against whatever font is
    // active at call time — if that's still the fallback font, ScrollTrigger
    // start/end positions computed from those boxes end up wrong once the
    // real webfont swaps in and reflows, and nothing here re-triggers a
    // recalculation. Waiting for fonts.ready avoids that mismatch entirely
    // instead of chasing it with more ScrollTrigger.refresh() calls.
    document.fonts.ready.then(() => {
      if (cancelled) return
      const isMobile = window.innerWidth <= 768

      const splitS3Heading = SplitText.create('.s3-heading', { type: 'chars' })
      splits.push(splitS3Heading)

      gsap.from(splitS3Heading.chars, {
        duration: 1.1,
        y: 120,
        autoAlpha: 0,
        transformOrigin: '50% 100%',
        stagger: { each: 0.08, ease: 'power2.in' },
        ease: 'back.out',
        scrollTrigger: {
          trigger: '.section-3',
          scroller: document.body,
          start: 'top 55%',
          once: true,
        },
      })

      if (!isMobile) {
        gsap.fromTo(
          '.s3-heading',
          { x: '30vw' },
          {
            x: '-15%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.section-3',
              scroller: document.body,
              start: 'top 100%',
              end: 'top 10%',
              scrub: 2,
            },
          }
        )
      } else {
        gsap.set('.s3-heading', { clearProps: 'transform,x' })
      }

      const phoneText = document.querySelector('.phone-text')
      if (phoneText) {
        const lines = phoneText.querySelectorAll('span')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.section-3', scroller: document.body, start: 'top 65%', scrub: true },
        })
        // The ±12% drift is a desktop flourish. On narrow phones the headline
        // already fills the width, so swinging it sideways pushes each line
        // off opposite edges. GSAP writes `transform` inline, which beats any
        // CSS override — so the amplitude has to be reduced here, not in CSS.
        const drift = window.innerWidth <= 480 ? 0 : 12
        tl.fromTo(lines[0], { x: `${drift}%` }, { x: `${-drift}%`, duration: 1.1, ease: 'power3.out' })
        tl.fromTo(lines[1], { x: `${-drift}%` }, { x: `${drift}%`, duration: 1.1, ease: 'power3.out' }, '-=0.75')
      }

      const s3Right = document.querySelector('.s3-right')
      if (s3Right) {
        const liveBadge = s3Right.querySelector('.live-badge')
        const title = s3Right.querySelector<HTMLElement>('.s3-title')
        const descMain = s3Right.querySelector('.s3-desc-main')
        const descSub = s3Right.querySelector('.s3-desc-sub')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.s3-right', scroller: document.body, start: 'top 60%', once: true },
        })

        if (liveBadge) {
          tl.fromTo(liveBadge, { scale: 0.6, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
        }

        if (title) {
          gsap.set(title, { perspective: 800 })
          const splitTitle = isMobile ? SplitText.create(title, { type: 'lines' }) : SplitText.create(title, { type: 'words' })
          splits.push(splitTitle)
          const targets = isMobile ? splitTitle.lines : splitTitle.words
          tl.fromTo(
            targets,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: { each: 0.06, from: 'start' } },
            '-=0.4'
          )
        }

        if (!isMobile && descMain) {
          const splitMain = SplitText.create(descMain, { type: 'lines' })
          splits.push(splitMain)
          tl.fromTo(
            splitMain.lines,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: { each: 0.12 } },
            '-=0.7'
          )
        }

        if (!isMobile && descSub) {
          tl.fromTo(descSub, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        }
      }
    })

    return () => {
      cancelled = true
      splits.forEach((s) => s.revert())
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
