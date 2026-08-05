'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import { PanoramaViewer } from './hero/PanoramaViewer'

const isLowEndDevice = () => {
  const isMobile = window.innerWidth <= 768
  const nav = navigator as Navigator & { deviceMemory?: number }
  const lowEndRAM = nav.deviceMemory !== undefined && nav.deviceMemory <= 2
  const lowEndCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  return isMobile && (lowEndRAM || lowEndCPU)
}

/**
 * Ported from index.html's section-2 + script.js lines 292–620. Two things
 * worth calling out because they look like bugs but are the live site's
 * actual, deliberate behavior:
 *
 *  1. The desktop scroll-driven reveal is dead code in the original (an
 *     empty `if (window.innerWidth > 768) {}` branch) — CSS force-shows
 *     the fullscreen content on desktop with `!important` regardless
 *     (homepage.css, the `@media (min-width: 768px)` block), so nothing
 *     needs to animate it there. Only screens ≤768px get the scroll-driven
 *     expand + reveal via ScrollTrigger.
 *  2. The `.feature-bar` element is reparented between `.content` and
 *     `.fullscreen-content` with GSAP Flip (matching the original's DOM
 *     manipulation exactly) rather than duplicated. This is safe here only
 *     because nothing else in this component re-renders after mount — if
 *     that ever changes, switch to two conditionally-rendered copies
 *     instead of imperative reparenting.
 */
export function ImmersiveBooking() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, Flip, SplitText)

    const isMobile = window.innerWidth <= 768
    const split = SplitText.create('.s2-headline-fs', { type: 'lines,chars', linesClass: 'split-line' })
    gsap.set('.split-line', { overflow: 'hidden', paddingBottom: '0.05em' })
    gsap.set(split.chars, { opacity: 1 })

    const targets = ['.feature-bar', '.fullscreen-content', '.feature-bar .feature-item']

    function animateCharsIn() {
      gsap.killTweensOf(split.chars)
      gsap.set(split.chars, { opacity: 0, x: 50, transformOrigin: 'bottom center' })
      gsap.to(split.chars, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: { each: isLowEndDevice() ? 0.015 : 0.02, from: 'start' },
      })
    }

    function animateCharsOut() {
      gsap.killTweensOf(split.chars)
      gsap.to(split.chars, {
        opacity: 0,
        x: '-60%',
        duration: 0.7,
        ease: 'power2.in',
        stagger: { each: 0.012, from: 'end' },
      })
    }

    const featureBar = document.querySelector<HTMLElement>('.feature-bar')
    const featureItems = featureBar?.querySelectorAll<HTMLElement>('.feature-item')
    const fullscreenContent = document.querySelector<HTMLElement>('.section-2 .fullscreen-content')
    const contentDiv = document.querySelector<HTMLElement>('.section-2 .content')
    if (!featureBar || !featureItems || !fullscreenContent || !contentDiv) return

    if (isMobile) gsap.set(featureBar, { opacity: 0 })

    function isFeatureBarMobile() {
      return window.matchMedia('(max-width: 768px)').matches
    }

    function flipToVertical() {
      if (isFeatureBarMobile()) {
        fullscreenContent!.appendChild(featureBar!)
        featureBar!.classList.add('vertical')
        gsap.set(featureBar, { opacity: 1, scale: 1 })
        gsap.fromTo(
          featureItems!,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: isLowEndDevice() ? 0.4 : 0.6,
            ease: 'power3.out',
            stagger: isLowEndDevice() ? 0.02 : 0.04,
            overwrite: true,
          }
        )
        return
      }

      const state = Flip.getState([featureBar!, ...Array.from(featureItems!)])
      fullscreenContent!.appendChild(featureBar!)
      featureBar!.classList.add('vertical')

      Flip.from(state, {
        duration: isLowEndDevice() ? 0.8 : 1.2,
        ease: 'power3.inOut',
        opacity: 1,
        nested: true,
        stagger: { each: isLowEndDevice() ? 0.04 : 0.08, from: 'start', ease: 'power2.inOut' },
        onStart() {
          gsap.to(featureBar, { scale: 0.97, opacity: 1, duration: 0.2, ease: 'power2.in', yoyo: true, repeat: 1 })
        },
        onEnter(els) {
          gsap.fromTo(
            els,
            { opacity: 0, y: 0 },
            {
              opacity: 1,
              y: 0,
              duration: isLowEndDevice() ? 0.4 : 0.6,
              ease: 'power3.out',
              stagger: isLowEndDevice() ? 0.03 : 0.07,
              delay: isLowEndDevice() ? 0.3 : 0.55,
            }
          )
        },
      })
    }

    function flipToHorizontal() {
      if (isFeatureBarMobile()) {
        contentDiv!.appendChild(featureBar!)
        featureBar!.classList.remove('vertical')
        gsap.set(featureBar, { opacity: 1, scale: 1 })
        gsap.fromTo(
          featureItems!,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -10,
            duration: isLowEndDevice() ? 0.3 : 0.4,
            ease: 'power3.in',
            stagger: isLowEndDevice() ? 0.01 : 0.03,
            overwrite: true,
            onComplete: () => {
              gsap.set(featureBar, { opacity: 0, scale: 1 })
            },
          }
        )
        return
      }

      const state = Flip.getState([featureBar!, ...Array.from(featureItems!)])
      contentDiv!.appendChild(featureBar!)
      featureBar!.classList.remove('vertical')

      Flip.from(state, {
        duration: isLowEndDevice() ? 0.7 : 0.9,
        ease: 'power3.inOut',
        opacity: 1,
        nested: true,
        stagger: { each: isLowEndDevice() ? 0.03 : 0.06, from: 'end', ease: 'power2.inOut' },
        onStart() {
          gsap.to(featureBar, { scale: 0.98, opacity: 1, duration: 0.2, ease: 'power2.in', yoyo: true, repeat: 1 })
        },
        onEnter(els) {
          gsap.fromTo(
            els,
            { opacity: 0, y: 0 },
            {
              opacity: 1,
              y: 0,
              duration: isLowEndDevice() ? 0.35 : 0.5,
              ease: 'power3.out',
              stagger: isLowEndDevice() ? 0.02 : 0.05,
              delay: isLowEndDevice() ? 0.25 : 0.45,
            }
          )
        },
      })
    }

    function showContent() {
      gsap.killTweensOf(targets)
      gsap.set('.fullscreen-content', { opacity: 1, pointerEvents: 'auto' })
      flipToVertical()
      if (isLowEndDevice()) {
        gsap.set('.s2-headline-fs', { opacity: 1, clearProps: 'all' })
      } else {
        gsap.delayedCall(0.8, animateCharsIn)
      }
    }

    function hideContent() {
      gsap.killTweensOf(targets)
      animateCharsOut()
      gsap.delayedCall(0.3, flipToHorizontal)
      gsap.to('.fullscreen-content', {
        opacity: 0,
        duration: 0.4,
        delay: 0.4,
        onComplete: () => {
          gsap.set('.fullscreen-content', { pointerEvents: 'none' })
        },
      })
    }

    let contentShown = false
    let cardExpanded = false
    let s2RefreshQueued = false

    // Layout changes (card going full-bleed) can shift where later sections'
    // ScrollTriggers should start, so a refresh is queued on each real
    // transition. This used to also write to a cross-component shared state
    // module read by the "Movodream Advantage" ring's mobile pin-start
    // position — that section is a static grid now, nothing reads it.
    function syncCardExpandedState(expanded: boolean) {
      if (cardExpanded === expanded) return
      cardExpanded = expanded
      if (s2RefreshQueued) return
      s2RefreshQueued = true
      requestAnimationFrame(() => {
        s2RefreshQueued = false
        ScrollTrigger.refresh(true)
      })
    }

    // Desktop branch intentionally does nothing — see doc comment above.
    if (window.innerWidth > 768) return

    gsap.fromTo(
      '.s2-card',
      { maxWidth: '90svw', maxHeight: '100%', borderRadius: isMobile ? 0 : 24 },
      {
        width: '100svw',
        height: '100svh',
        maxWidth: '100svw',
        maxHeight: '100svh',
        borderRadius: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.s2-card-wrapper',
          scroller: document.body,
          start: isMobile ? 'top 30%' : 'top 85%',
          end: 'top top',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress
            if (p > 0.45 && !contentShown) {
              contentShown = true
              showContent()
            }
            if (p < 0.35 && contentShown) {
              contentShown = false
              hideContent()
            }
          },
          onLeave() {
            syncCardExpandedState(true)
          },
          onEnterBack() {
            syncCardExpandedState(false)
          },
        },
      }
    )
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
      </div>
    </section>
  )
}
