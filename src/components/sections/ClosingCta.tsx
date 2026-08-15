'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useOpenContactModal } from '@/components/layout/ContactModal'
import { useOpenExploreModal } from '@/components/layout/ExploreAppModal'

/**
 * Redesigned per client-approved reference: a dark gradient closing CTA
 * card instead of the previous full-bleed light "Ready to see..." section.
 * Both buttons route to real, already-wired flows — there's no separate
 * "free signup" or "book a demo" flow on this site, so "Start Planning"
 * opens the same contact modal used site-wide and "Explore the App" opens
 * the existing iOS/Android chooser modal, rather than inventing new ones.
 */
export function ClosingCta() {
  const openContactModal = useOpenContactModal()
  const openExploreModal = useOpenExploreModal()

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const readySubtext = document.querySelector<HTMLElement>('.ready-subtext')
    const readyActions = document.querySelector<HTMLElement>('.ready-actions')
    if (!readySubtext) return

    let cancelled = false
    let splitSub: SplitText | null = null

    // See ClarityIntel.tsx's fonts.ready comment — same fix, same reason:
    // splitting text before the real webfont has loaded measures word
    // widths against the fallback font, and nothing here recomputes once
    // it swaps in.
    document.fonts.ready.then(() => {
      if (cancelled) return

      const readyTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ready-section',
          scroller: document.body,
          start: 'top 70%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      splitSub = SplitText.create(readySubtext, { type: 'words' })
      gsap.set(readySubtext, { autoAlpha: 1 })

      readyTl.fromTo(
        splitSub.words,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: { each: 0.025, from: 'start' } }
      )

      if (readyActions) {
        readyTl.fromTo(
          readyActions,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
      }
    })

    return () => {
      cancelled = true
      splitSub?.revert()
    }
  }, [])

  return (
    <section className="ready-section">
      <div className="ready-card">
        <div className="ready-text">
          <p className="ready-eyebrow">Ready to travel smarter?</p>
          <h2 className="ready-headline">
            Let <span className="gradient-text">AI</span> plan. You explore.
          </h2>
          <p className="ready-subtext">
            Smart itineraries, real-time recommendations, and local insights crafted by AI — so you can focus on the
            journey.
          </p>
        </div>

        <div className="ready-actions">
          <button type="button" className="demo-button qzv-launcher" onClick={openContactModal}>
            Start Planning
          </button>
          <button type="button" className="ready-secondary-button" onClick={openExploreModal}>
            Explore the App
          </button>
        </div>
      </div>
    </section>
  )
}
