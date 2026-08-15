'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PanoramaViewer } from './hero/PanoramaViewer'

// Same 3 items as the desktop .feature-bar, verbatim — label + description,
// nothing invented for the mobile carousel. Icons are purely decorative.
const MOBILE_FEATURES = [
  { icon: '🔮', color: 'pink', label: '360° AR/VR Previews', desc: 'Walk through before you book. Expert-verified. No surprises.' },
  { icon: '🧭', color: 'purple', label: 'Live AR Navigation', desc: 'Directions on your real-world view. No squinting at maps.' },
  { icon: '🧠', color: 'teal', label: 'Context-Aware Guidance', desc: 'Your AI knows where you are and what you love. Surfaces immersive views automatically.' },
]

const AUTOPLAY_INTERVAL_MS = 3500
const RESUME_AFTER_MS = 4500

export function ImmersiveBooking() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // True only while a scroll WE triggered (autoplay tick / dot click) is in
  // flight — lets the scroll handler tell that apart from a real user
  // swipe/drag, which pointer enter/leave can't reliably do on touch (a
  // drag doesn't fire pointerleave mid-gesture the way a mouse does, so the
  // autoplay interval kept running under a user's thumb and yanked the
  // scroll back mid-swipe — that's what made manual swiping feel broken).
  const isProgrammaticScroll = useRef(false)
  // Logical position, 0..MOBILE_FEATURES.length — the last value points at
  // the cloned first card appended after the real ones (see JSX below).
  const positionRef = useRef(0)

  useGSAP(() => {
    gsap.registerPlugin(SplitText)

    let cancelled = false
    let split: SplitText | null = null

    // See ClarityIntel.tsx's fonts.ready comment — splitting before the
    // real webfont loads measures against the fallback font's line breaks.
    document.fonts.ready.then(() => {
      if (cancelled) return
      split = SplitText.create('.s2-headline-fs', { type: 'lines,chars', linesClass: 'split-line' })
      gsap.set('.split-line', { overflow: 'hidden', paddingBottom: '0.05em' })
      gsap.set(split.chars, { opacity: 1 })
    })

    return () => {
      cancelled = true
      split?.revert()
    }
  }, [])

  function stopAutoplay() {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = null
  }

  function scheduleResume() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(startAutoplay, RESUME_AFTER_MS)
  }

  function handleTrackScroll() {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children) as HTMLElement[]
    const trackCenter = track.scrollLeft + track.clientWidth / 2
    let closest = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - trackCenter)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    // The clone (index === MOBILE_FEATURES.length) is a visual stand-in for
    // card 0 — light its dot instead of trying to render a 4th dot.
    setActiveCard(closest % MOBILE_FEATURES.length)
    // Keep autoplay's own position tracking in sync with wherever a manual
    // swipe actually left the track, so resuming continues from there
    // instead of from stale state.
    positionRef.current = closest

    // A scroll event we didn't trigger ourselves is a real user drag/swipe/
    // wheel — pause immediately and only resume once they've stopped
    // touching it for a bit (each further scroll event pushes the resume
    // timer back out, so it only actually fires once they're done).
    if (!isProgrammaticScroll.current) {
      stopAutoplay()
      scheduleResume()
    }
  }

  function scrollToPosition(index: number, behavior: ScrollBehavior) {
    const track = trackRef.current
    if (!track) return
    const card = track.children[index] as HTMLElement | undefined
    if (!card) return
    isProgrammaticScroll.current = true
    if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current)
    // Long enough to cover a 'smooth' scroll's animation; harmless if it's
    // actually 'instant' and finishes sooner.
    programmaticScrollTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 700)
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior })
  }

  // Manual dot clicks only ever target a real card (0..2).
  function scrollToCard(index: number) {
    positionRef.current = index
    scrollToPosition(index, 'smooth')
  }

  function startAutoplay() {
    stopAutoplay()
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    autoplayTimer.current = setInterval(() => {
      const next = positionRef.current + 1
      positionRef.current = next
      // Always scrolls further right (forward) even into the clone slot —
      // never backward through the deck to reach card 1 again. Once the
      // smooth scroll into the clone finishes, jump (no animation) back to
      // the real card 0 underneath it; visually identical, so the reset is
      // invisible and the next tick continues forward normally.
      scrollToPosition(next, 'smooth')
      if (next === MOBILE_FEATURES.length) {
        setTimeout(() => {
          scrollToPosition(0, 'instant')
          positionRef.current = 0
        }, 500)
      }
    }, AUTOPLAY_INTERVAL_MS)
  }

  // Dot clicks pause and resume after a quiet period (there's no "hover"
  // equivalent for a discrete click).
  function pauseAutoplayThenResume() {
    stopAutoplay()
    scheduleResume()
  }

  useEffect(() => {
    startAutoplay()
    return () => {
      stopAutoplay()
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
      if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current)
    }
  }, [])

  return (
    <section className="section-2">
      <h1 className="s2-headline">
        A Future Where <br />
        Journeys Come Alive
      </h1>
      <p className="subs2-headline">
        Where exploration is immersive, intuitive, and enhance experience. Where people focus on wonder, not
        logistics
      </p>

      <div className="s2-card-wrapper">
        <div className="s2-card">
          <PanoramaViewer
            desktopSrc="/assets/images/panos/hi/03/tajpano.webp"
            mobileSrc="/assets/images/panos/hi/03/tajpano-mb.webp"
            blurSrc="/assets/images/panos/hi/03/tajpano-blur.webp"
            placeholderSrc="/assets/images/panos/hi/03/placeholder.png"
          />
          <div className="fullscreen-content">
            <h2 className="s2-headline-fs">
              An immersive Travel
              <br />
              booking experience
            </h2>
          </div>
          <div className="content">
            <div className="feature-bar">
              <div className="feature-item">
                <div className="feature-label pink">360° AR/VR Previews</div>
                <div className="feature-desc">Walk through before you book. Expert-verified. No surprises.</div>
              </div>
              <div className="feature-item">
                <div className="feature-label purple">Live AR Navigation</div>
                <div className="feature-desc">Directions on your real-world view. No squinting at maps.</div>
              </div>
              <div className="feature-item">
                <div className="feature-label teal">Context-Aware Guidance</div>
                <div className="feature-desc">
                  Your AI knows where you are and what you love. Surfaces immersive views automatically.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Premium Swipeable Glass Carousel (Visible on <= 768px) */}
        <div className="mobile-immersive-features">
          <div
            className="mobile-carousel-track"
            ref={trackRef}
            onScroll={handleTrackScroll}
            // Paused for as long as the cursor/finger is actually on a
            // card — not a timed pause — and picks back up the moment it
            // leaves, whether that was just a hover or a manual swipe/click.
            onPointerEnter={stopAutoplay}
            onPointerLeave={startAutoplay}
          >
            {MOBILE_FEATURES.map((f) => (
              <div className="mobile-feature-card" key={f.label}>
                <span className={`mobile-feature-badge ${f.color}`}>
                  <span className="mobile-feature-badge-icon">{f.icon}</span>
                  {f.label}
                </span>
                <p className="mobile-feature-desc">{f.desc}</p>
              </div>
            ))}
            {/* Clone of card 0, appended so autoplay can always scroll
                forward — see startAutoplay's comment. */}
            <div className="mobile-feature-card" aria-hidden="true">
              <span className={`mobile-feature-badge ${MOBILE_FEATURES[0].color}`}>
                <span className="mobile-feature-badge-icon">{MOBILE_FEATURES[0].icon}</span>
                {MOBILE_FEATURES[0].label}
              </span>
              <p className="mobile-feature-desc">{MOBILE_FEATURES[0].desc}</p>
            </div>
          </div>

          <div className="mobile-carousel-dots">
            {MOBILE_FEATURES.map((f, i) => (
              <button
                key={f.label}
                type="button"
                className={`mobile-carousel-dot${i === activeCard ? ' active' : ''}`}
                aria-label={`Go to feature ${i + 1}`}
                onClick={() => {
                  scrollToCard(i)
                  pauseAutoplayThenResume()
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
