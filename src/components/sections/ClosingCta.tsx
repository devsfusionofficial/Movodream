'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useOpenContactModal } from '@/components/layout/ContactModal'

/**
 * Ported from index.html's "ready-section" + script.js lines 1043–1120.
 * Only the subtext word-cascade and the button's scale-pop are live in the
 * original — a headline char-split entrance exists in script.js but is
 * entirely commented out there, so the headline just renders statically
 * here too (not "finishing" an animation that was never shipped).
 * `.gradient-text` and `.demo-button-utext` have zero CSS rules in the
 * live site (misleading class names, no actual gradient) — left unstyled
 * to match, not invented.
 */
export function ClosingCta() {
  const openContactModal = useOpenContactModal()

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const readySubtext = document.querySelector<HTMLElement>('.ready-subtext')
    const demoButton = document.querySelector<HTMLElement>('.ready-section .demo-button')
    if (!readySubtext) return

    const readyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.ready-section',
        scroller: document.body,
        start: 'top -50%',
        once: true,
        invalidateOnRefresh: true,
      },
    })

    const splitSub = SplitText.create(readySubtext, { type: 'words' })
    gsap.set(readySubtext, { autoAlpha: 1 })

    readyTl.fromTo(
      splitSub.words,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: { each: 0.025, from: 'start' } }
    )

    if (demoButton) {
      readyTl.fromTo(demoButton, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.3')
    }
  }, [])

  return (
    <>
      <section className="ready-section">
        <div className="ready-content">
          <h2 className="ready-headline">
            Ready to see what real
            <span className="gradient-text"> AI travel looks like?</span>
          </h2>
          <p className="ready-subtext">
            Your dream trip shouldn&apos;t come from a template. Movodream learns your style. Local experts verify
            every place. AI plans, books, and guides — with 360° previews, AR/VR navigation, and live real-time
            guidance.
          </p>

          <button type="button" className="demo-button qzv-launcher" onClick={openContactModal}>
            GET A DEMO
          </button>

          <p className="demo-button-utext" style={{ fontWeight: 800, marginTop: 28 }}>
            Just a conversation about travel that actually works.
          </p>
        </div>
      </section>
      <p className="demo-button-sub">Built for travelers. Trusted by partners. Verified by locals.</p>
    </>
  )
}
