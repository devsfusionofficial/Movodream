'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Atropos from 'atropos/react'
import 'atropos/css'
import { useLenis } from '@/components/animation/SmoothScrollProvider'

/**
 * Ported from index.html's section-4 + script.js lines 1367–1656. The
 * transition system: on desktop the whole section pins for `+=150%` of
 * scroll, and ScrollTrigger's onUpdate advances exactly one slide at a
 * time (never skips), snapping scroll to that slide's target progress via
 * Lenis while GSAP animates the slide content in/out. On mobile it's
 * natural-flow — each slide gets its own one-shot entrance ScrollTrigger,
 * reusing the same s4SlideIn animation. gsap.matchMedia handles the
 * desktop/mobile split and its own cleanup on breakpoint change.
 *
 * One faithful-but-odd detail: the idle tilt effect only targets the
 * *first* `.s4-card` in the DOM (slide 1's), because the original uses
 * `document.querySelector('.s4-card')` (singular). Slides 2 and 3 don't
 * get it — preserved as-is, not "fixed" to apply everywhere.
 */
export function PlatformSlides() {
  const lenisRef = useLenis()

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    const isMobile = window.innerWidth <= 768

    const s4Slides = Array.from(document.querySelectorAll<HTMLElement>('.s4-slide'))
    if (s4Slides.length === 0) return

    let s4CurrentSlide = -1
    let s4IsAnimating = false

    function s4SlideIn(slideEl: HTMLElement) {
      const left = slideEl.querySelector('.s4-left')
      const eyebrow = slideEl.querySelector('.s4-eyebrow')
      const heading = slideEl.querySelector('.s4-heading')
      const bullets = slideEl.querySelectorAll('.s4-bullets li')
      const tags = slideEl.querySelectorAll('.s4-tags .s4-tag')
      const subText = slideEl.querySelector('.sub')
      const cta = slideEl.querySelector('.s4-slide-cta')

      const tl = gsap.timeline()
      gsap.set(slideEl, { opacity: 1, pointerEvents: 'auto' })
      slideEl.classList.add('is-active')

      tl.fromTo(
        left,
        { scale: 0.72, autoAlpha: 0, y: 48, rotationY: -12, transformOrigin: 'center bottom' },
        { scale: 1, autoAlpha: 1, y: 0, rotationY: 0, duration: 0.7, ease: 'back.out(1.5)' }
      )

      const floatingEls = slideEl.querySelectorAll('.city-badge, .start-card')
      if (floatingEls.length) {
        tl.from(floatingEls, { scale: 0.6, autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, '-=0.35')
      }
      if (eyebrow) {
        tl.fromTo(eyebrow, { x: 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, '-=0.5')
      }
      if (heading) {
        tl.fromTo(heading, { x: 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, '-=0.35')
      }
      if (bullets.length && !isMobile) {
        tl.fromTo(bullets, { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, '-=0.3')
      }
      if (tags.length && !isMobile) {
        tl.fromTo(
          tags,
          { x: 50, autoAlpha: 0, scale: 0.88 },
          { x: 0, autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: 'expo.out' },
          '-=0.2'
        )
      }
      if (subText) {
        tl.fromTo(subText, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
      }
      if (cta) {
        tl.fromTo(cta, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' }, '-=0.25')
      }
      return tl
    }

    function s4SlideOut(slideEl: HTMLElement, onDone: () => void) {
      const children = slideEl.querySelectorAll('.s4-left, .s4-eyebrow, .s4-heading, .s4-bullets li, .s4-tags .s4-tag')
      gsap.to(children, {
        y: -50,
        autoAlpha: 0,
        scale: 0.94,
        duration: 0.3,
        stagger: 0.015,
        ease: 'power2.in',
        onComplete() {
          gsap.set(slideEl, { opacity: 0, pointerEvents: 'none' })
          slideEl.classList.remove('is-active')
          gsap.set(children, { clearProps: 'all' })
          onDone()
        },
      })
    }

    function s4GoToSlide(nextIdx: number, onComplete?: () => void) {
      if (nextIdx === s4CurrentSlide) {
        onComplete?.()
        return
      }
      const prevIdx = s4CurrentSlide
      s4CurrentSlide = nextIdx

      if (prevIdx >= 0 && s4Slides[prevIdx]) {
        s4SlideOut(s4Slides[prevIdx], () => {
          const tl = s4SlideIn(s4Slides[nextIdx])
          if (onComplete) tl.eventCallback('onComplete', onComplete)
        })
      } else {
        const tl = s4SlideIn(s4Slides[nextIdx])
        if (onComplete) tl.eventCallback('onComplete', onComplete)
      }
    }

    // ── s4-card idle tilt (first .s4-card only — see doc comment) ──
    const s4CardEl = document.querySelector<HTMLElement>('.s4-card')
    let idleTilt: gsap.core.Timeline | null = null
    const onCardEnter = () => {
      idleTilt?.pause()
      const s4Rotate = s4CardEl?.querySelector('.atropos-rotate')
      if (s4Rotate) gsap.to(s4Rotate, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'power2.out' })
    }
    const onCardLeave = () => {
      gsap.delayedCall(0.35, () => idleTilt?.resume())
    }

    if (s4CardEl) {
      const s4Rotate = s4CardEl.querySelector('.atropos-rotate')
      if (s4Rotate) {
        gsap.set(s4CardEl.querySelector('.atropos-inner'), { transformStyle: 'preserve-3d' })
        idleTilt = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
        idleTilt
          .to(s4Rotate, { rotationX: 8, rotationY: -12, duration: 3.8 })
          .to(s4Rotate, { rotationX: -6, rotationY: 10, duration: 4.2 })
          .to(s4Rotate, { rotationX: 10, rotationY: 4, duration: 3.5 })
          .to(s4Rotate, { rotationX: -4, rotationY: -8, duration: 4.0 })
        s4CardEl.addEventListener('mouseenter', onCardEnter)
        s4CardEl.addEventListener('mouseleave', onCardLeave)
      }
    }

    const s4MM = gsap.matchMedia()

    s4MM.add('(min-width: 769px)', () => {
      const pinST = ScrollTrigger.create({
        trigger: '.section-4',
        scroller: document.body,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        onUpdate(self) {
          if (s4IsAnimating) return
          const p = self.progress
          let rawIdx = 0
          if (p > 0.33 && p <= 0.66) rawIdx = 1
          else if (p > 0.66) rawIdx = 2

          if (rawIdx !== s4CurrentSlide && rawIdx >= 0) {
            const nextIdx = rawIdx > s4CurrentSlide ? s4CurrentSlide + 1 : s4CurrentSlide - 1
            if (nextIdx >= 0 && nextIdx < 3 && nextIdx !== s4CurrentSlide) {
              s4IsAnimating = true
              lenisRef.current?.stop()
              const targetProgress = nextIdx === 0 ? 0.15 : nextIdx === 1 ? 0.5 : 0.85
              const targetScroll = self.start + (self.end - self.start) * targetProgress
              lenisRef.current?.scrollTo(targetScroll, { duration: 0.5 })
              s4GoToSlide(nextIdx)
              setTimeout(() => {
                s4IsAnimating = false
                lenisRef.current?.start()
              }, 700)
            }
          }
        },
        onEnter() {
          if (s4CurrentSlide === -1) {
            s4IsAnimating = true
            s4GoToSlide(0)
            setTimeout(() => {
              s4IsAnimating = false
            }, 700)
          }
        },
        invalidateOnRefresh: true,
      })

      return () => {
        pinST.kill()
        s4Slides.forEach((sl) => {
          sl.classList.remove('is-active')
          gsap.set(sl, { clearProps: 'all' })
        })
        s4CurrentSlide = -1
      }
    })

    s4MM.add('(max-width: 768px)', () => {
      s4CurrentSlide = -1
      s4Slides.forEach((slideEl) => {
        slideEl.classList.remove('is-active')
        gsap.set(slideEl, { opacity: 0 })
      })

      const mobileTriggers = s4Slides.map((slideEl) =>
        ScrollTrigger.create({
          trigger: slideEl,
          scroller: document.body,
          start: 'top 50%',
          once: true,
          onEnter: () => s4SlideIn(slideEl),
          invalidateOnRefresh: true,
        })
      )

      return () => {
        mobileTriggers.forEach((t) => t.kill())
        s4Slides.forEach((sl) => {
          sl.classList.remove('is-active')
          gsap.set(sl, { clearProps: 'all' })
        })
      }
    })

    ScrollTrigger.refresh()

    return () => {
      s4MM.revert()
      idleTilt?.kill()
      s4CardEl?.removeEventListener('mouseenter', onCardEnter)
      s4CardEl?.removeEventListener('mouseleave', onCardLeave)
    }
  }, [])

  return (
    <section id="platform" className="section-4">
      <div className="s4-slides-wrapper">
        <div className="s4-slide slide1" data-slide="0">
          <div className="s4-left">
            <Atropos className="s4-card" highlight={false} shadow={false}>
              <svg className="dashed-border-svg" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="23" ry="23" fill="none" stroke="#D71789" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" />
              </svg>
              <div className="photo-card">
                <Image src="/assets/images/taj2.webp" className="card-img" alt="Movodream" width={320} height={420} style={{ width: '100%', height: '100%' }} />
                <div className="action-buttons">
                  <div className="action-btn">
                    <Image src="/assets/icons/s4-action-ai.svg" alt="" width={22} height={22} />
                  </div>
                  <div className="action-btn">
                    <Image src="/assets/icons/s4-action-edit.svg" alt="" width={15} height={15} />
                  </div>
                  <div className="action-btn">
                    <Image src="/assets/icons/s4-action-plane.svg" alt="" width={19} height={17} />
                  </div>
                </div>
              </div>
              <div className="city-badge">
                <span className="icon">
                  <Image src="/assets/icons/s4-city-badge-plan.svg" alt="" width={20} height={27} />
                </span>
                PLAN
              </div>
              <div className="tag-book">
                <i className="fa-solid fa-plane tag-icon" />
                <span className="tag-text">BOOK</span>
              </div>
              <div className="start-card">
                <p>Just tell your vibe</p>
                <div className="arrow-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            </Atropos>
          </div>

          <div className="s4-right">
            <p className="s4-eyebrow">
              <span>–</span> Intelligent Planning &amp; Booking <span>–</span>
            </p>
            <h2 className="s4-heading">Start planning with modern AI</h2>
            <ul className="s4-bullets">
              <li><span>AI insights from millions of real trips</span></li>
              <li><span>One-click booking — flights, stays, experiences</span></li>
              <li><span>Expert-verified POIs only</span></li>
              <li><span>Real-time prices and availability</span></li>
            </ul>
            <div className="s4-tags">
              <span className="s4-tag grey">
                <Image src="/assets/icons/s4-tag-grey-planning.svg" alt="" width={13} height={13} />
                Intelligent Planning
              </span>
              <span className="s4-tag pink">
                <Image src="/assets/icons/s4-tag-pink-insights.svg" alt="" width={14} height={13} />
                AI-driven insights
              </span>
              <span className="s4-tag purple">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Real-time
              </span>
              <span className="s4-tag yellow">
                <Image src="/assets/icons/s4-tag-yellow-recommend.svg" alt="" width={15} height={15} />
                Smart recommendations
              </span>
            </div>
          </div>
        </div>

        <div className="s4-slide" data-slide="1">
          <div className="s4-left">
            <Atropos className="s4-card two" highlight={false} shadow={false}>
              <svg className="dashed-border-svg" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="23" ry="23" fill="none" stroke="#D71789" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" />
              </svg>
              <div className="photo-card">
                <Image src="/assets/images/oneclickbooking.webp" className="card-img slide2-img" alt="Movodream" width={320} height={420} style={{ width: '100%', height: '100%' }} />
              </div>
              <div className="city-badge city-badge2">
                <span className="imgs">
                  <Image src="/assets/images/dark-mountains.png" width={47} height={47} alt="Travel planning" />
                  <Image src="/assets/images/tower.png" width={47} height={47} alt="Travel planning" />
                </span>
                <span className="textsl2">
                  <span>VISITED</span>
                  <span>Already visited 299 places</span>
                </span>
              </div>
              <div className="sm-badge">
                <Image width={46} height={46} src="/assets/images/sun.png" alt="sunny locations" />
                <span className="text">Summer Locations</span>
              </div>
            </Atropos>
          </div>

          <div className="s4-right">
            <p className="s4-eyebrow">
              <span>–</span> Context Awareness <span>–</span>
            </p>
            <h2 className="s4-heading md">Total memory. Knows preferences &amp; intent</h2>
            <ul className="s4-bullets">
              <li><span>Remembers everything across your journey</span></li>
              <li><span>Understands intent, not just keywords</span></li>
              <li><span>Adapts to live conditions automatically</span></li>
              <li><span>Never asks for the same info twice</span></li>
            </ul>
            <div className="s4-tags">
              <span className="s4-tag yellow">
                <Image src="/assets/icons/s4-tag-yellow-memory.svg" alt="" width={11} height={12} />
                Context memory
              </span>
              <span className="s4-tag pink">
                <Image src="/assets/icons/s4-tag-pink-understands.svg" alt="" width={13} height={13} />
                Understands Intent
              </span>
              <span className="s4-tag purple">
                <Image src="/assets/icons/s4-tag-purple-adaptive.svg" alt="" width={13} height={10} />
                Adaptive
              </span>
            </div>
          </div>
        </div>

        <div className="s4-slide three" data-slide="2">
          <div className="s4-left">
            <div className="s4-card">
              <div className="orb-wrapper">
                <video
                  style={{ pointerEvents: 'none' }}
                  className="orb-anim"
                  muted
                  autoPlay
                  loop
                  disablePictureInPicture
                  playsInline
                  preload="auto"
                >
                  <source src="/assets/images/orb.mp4" type="video/mp4" />
                </video>
              </div>
              <svg className="dashed-circle" width="100%" viewBox="0 0 494 494" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="247" cy="247" r="246.25" stroke="#D71789" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="10 6" />
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dashed-circle2" width="80%" src="/assets/icons/s4-dashed-circle-2.svg" alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dashed-circle3" width="76%" src="/assets/icons/s4-dashed-circle-3.svg" alt="" />

              <div className="circle-images-container">
                <Image src="/assets/images/slider-msg-2.svg" alt="" width={190} height={80} />
                <Image src="/assets/images/circle-loc-2.png" alt="" width={76} height={76} />
                <Image src="/assets/images/slider-bali-loc.svg" alt="" width={165} height={70} />
                <Image src="/assets/images/899-more-locations.svg" alt="" width={145} height={60} />
                <Image src="/assets/images/slider-msg1.svg" alt="" width={175} height={70} />
                <Image src="/assets/images/slider-eiffil-tag.svg" alt="" width={165} height={60} />
                <Image src="/assets/images/star-loc.png" alt="" width={64} height={64} />
              </div>
            </div>
          </div>

          <div className="s4-right">
            <p className="s4-eyebrow s3">
              <span>
                <span>–</span> Seamless Assistance <span>–</span>
              </span>
              <span className="s4-tag green">
                <Image src="/assets/icons/s4-tag-green-live.svg" alt="" width={16} height={16} />
                Live
              </span>
            </p>
            <h2 className="s4-heading s4-heading-sm">Smart guidance that adapts quietly</h2>
            <ul className="s4-bullets">
              <li><span>Live AR navigation — turn by turn on your real world</span></li>
              <li><span>Real-time alerts for delays, closures, hidden gems</span></li>
              <li><span>24/7 AI guide with local guru verification</span></li>
              <li><span>Zero app switching. Zero stress</span></li>
            </ul>
            <div className="s4-tags">
              <span className="s4-tag yellow">
                <Image src="/assets/icons/s4-tag-yellow-intuitive.svg" alt="" width={14} height={14} />
                intuitive experience
              </span>
              <span className="s4-tag purple">
                <Image src="/assets/icons/s4-tag-purple-adaptive.svg" alt="" width={13} height={10} />
                Smart guide
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
