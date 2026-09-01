'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Atropos from 'atropos/react'
import 'atropos/css'
import { useLenis } from '@/components/animation/SmoothScrollProvider'
import { navClickGuard } from '@/lib/section-nav-guard'

/**
 * Product slides — pinned/scroll-jacked, ported from the live site's
 * script.js (lines ~1367-1620): the section pins for 150% of a scroll and
 * steps through the 3 slides one at a time as the user scrolls, snapping to
 * each slide's centered scroll position.
 *
 * Unlike the original, this runs the SAME pinned behavior at every viewport
 * width, including mobile — the client wants the effect consistent across
 * the whole app, not just desktop (the original only pinned above 768px and
 * fell back to plain natural-flow scrolling on mobile).
 *
 * That does mean adapting one piece the original leaned on desktop-only
 * infrastructure for: the slide-to-slide snap-scroll uses the shared Lenis
 * instance (`useLenis`) when one exists (desktop — see
 * SmoothScrollProvider.tsx), and falls back to GSAP's ScrollToPlugin
 * (compatible with ScrollTrigger.normalizeScroll, which is what runs on
 * mobile instead of Lenis) when it doesn't.
 *
 * One faithful-but-odd detail kept from the original: the idle tilt effect
 * only targets the *first* `.s4-card` in the DOM (slide 1's), because the
 * source uses `document.querySelector('.s4-card')` (singular). Slides 2
 * and 3 don't get it — preserved as-is, not "fixed" to apply everywhere.
 */
export function PlatformSlides() {
  const lenisRef = useLenis()

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

    const s4Slides = Array.from(document.querySelectorAll<HTMLElement>('.s4-slide'))
    if (s4Slides.length === 0) return

    const mm = gsap.matchMedia()

    // ── DESKTOP & TABLET (> 768px): Pinned 3-slide interactive showcase & 3D tilt
    mm.add('(min-width: 769px)', () => {
      // ── s4-card idle tilt on all cards ──
      const s4CardEls = Array.from(document.querySelectorAll<HTMLElement>('.s4-card'))
      const idleTilts: gsap.core.Timeline[] = []
      const cardCleanups: (() => void)[] = []

      s4CardEls.forEach((cardEl) => {
        const s4Rotate = cardEl.querySelector<HTMLElement>('.atropos-inner')
        if (s4Rotate) {
          gsap.set(s4Rotate, { transformStyle: 'preserve-3d' })
          const tiltTL = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
          tiltTL
            .to(s4Rotate, { rotationX: 8, rotationY: -12, duration: 3.8 })
            .to(s4Rotate, { rotationX: -6, rotationY: 10, duration: 4.2 })
            .to(s4Rotate, { rotationX: 10, rotationY: 4, duration: 3.5 })
            .to(s4Rotate, { rotationX: -4, rotationY: -8, duration: 4.0 })
          idleTilts.push(tiltTL)

          const onEnter = () => {
            tiltTL.pause()
            const atroposRotate = cardEl.querySelector<HTMLElement>('.atropos-rotate')
            if (atroposRotate) gsap.to(atroposRotate, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'power2.out' })
          }
          const onLeave = () => {
            gsap.delayedCall(0.35, () => tiltTL.resume())
          }

          cardEl.addEventListener('mouseenter', onEnter)
          cardEl.addEventListener('mouseleave', onLeave)

          cardCleanups.push(() => {
            cardEl.removeEventListener('mouseenter', onEnter)
            cardEl.removeEventListener('mouseleave', onLeave)
          })
        }
      })

      let activeIndex = -1

      function showSlide(targetIdx: number) {
        if (targetIdx === activeIndex) return
        const prevIdx = activeIndex
        activeIndex = targetIdx

        s4Slides.forEach((slide, idx) => {
          gsap.killTweensOf(slide)

          if (idx === targetIdx) {
            slide.classList.add('is-active')
            slide.style.visibility = 'visible'
            slide.style.pointerEvents = 'auto'

            if (prevIdx === -1) {
              gsap.set(slide, { opacity: 1, y: 0 })
            } else {
              const movingDown = targetIdx > prevIdx
              gsap.fromTo(
                slide,
                { opacity: 0, y: movingDown ? 28 : -28 },
                { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
              )
            }
          } else if (idx === prevIdx && prevIdx !== -1) {
            slide.classList.remove('is-active')
            slide.style.pointerEvents = 'none'
            const movingDown = targetIdx > prevIdx

            gsap.to(slide, {
              opacity: 0,
              y: movingDown ? -24 : 24,
              duration: 0.32,
              ease: 'power2.in',
              onComplete: () => {
                if (idx !== activeIndex) {
                  slide.style.visibility = 'hidden'
                  gsap.set(slide, { y: 0, opacity: 0 })
                }
              },
            })
          } else {
            slide.classList.remove('is-active')
            slide.style.visibility = 'hidden'
            slide.style.pointerEvents = 'none'
            gsap.set(slide, { opacity: 0, y: 0 })
          }
        })
      }

      showSlide(0)

      const sectionEl = document.querySelector<HTMLElement>(`.section-4`)
      const wrapperEl = document.querySelector<HTMLElement>(`.s4-slides-wrapper`)

      function applySectionHeight() {
        if (!sectionEl || !wrapperEl) return
        let max = window.innerHeight
        s4Slides.forEach((slideEl) => {
          const prevPosition = slideEl.style.position
          const prevHeight = slideEl.style.height
          slideEl.style.position = 'static'
          slideEl.style.height = 'auto'
          max = Math.max(max, slideEl.offsetHeight)
          slideEl.style.position = prevPosition
          slideEl.style.height = prevHeight
        })
        const natural = max + 10
        const visual = Math.min(natural, window.innerHeight)
        const scale = visual / natural
        sectionEl.style.height = `${visual}px`
        wrapperEl.style.height = `${natural}px`
        wrapperEl.style.transform = scale < 1 ? `scale(${scale})` : ''
        wrapperEl.style.transformOrigin = 'center center'
      }
      applySectionHeight()
      ScrollTrigger.addEventListener('refreshInit', applySectionHeight)
      window.addEventListener('resize', applySectionHeight)

      const pinST = ScrollTrigger.create({
        trigger: '.section-4',
        start: 'top top',
        end: '+=160%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate(self) {
          if (navClickGuard.current) return
          const p = self.progress
          const dir = self.direction

          let targetIdx = activeIndex
          if (dir >= 0) {
            if (activeIndex === 0 && p > 0.25) targetIdx = 1
            else if (activeIndex === 1 && p > 0.60) targetIdx = 2
          } else {
            if (activeIndex === 2 && p < 0.68) targetIdx = 1
            else if (activeIndex === 1 && p < 0.32) targetIdx = 0
          }

          if (targetIdx !== activeIndex) {
            showSlide(targetIdx)
          }
        },
        onRefresh(self) {
          applySectionHeight()
          const p = self.progress
          let targetIdx = 0
          if (p > 0.60) targetIdx = 2
          else if (p > 0.25) targetIdx = 1
          showSlide(targetIdx)
        },
        invalidateOnRefresh: true,
      })

      // Immediately sync slide on mount/desktop switch based on current scroll
      const initP = pinST.progress
      if (initP > 0.60) showSlide(2)
      else if (initP > 0.25) showSlide(1)
      else showSlide(0)

      return () => {
        pinST.kill()
        idleTilts.forEach((t) => t.kill())
        cardCleanups.forEach((c) => c())
        ScrollTrigger.removeEventListener('refreshInit', applySectionHeight)
        window.removeEventListener('resize', applySectionHeight)
      }
    })

    // ── MOBILE (<= 768px): Completely static, natural stacked flow with NO animations
    mm.add('(max-width: 768px)', () => {
      s4Slides.forEach((slide) => {
        slide.classList.add('is-active')
        slide.style.zIndex = ''
        slide.style.visibility = ''
        gsap.killTweensOf(slide)
        gsap.set(slide, { opacity: 1, pointerEvents: 'auto', y: 0, clearProps: 'all' })

        const card = slide.querySelector<HTMLElement>('.s4-left .s4-card')
        const right = slide.querySelector<HTMLElement>('.s4-right')
        if (card) {
          gsap.killTweensOf(card)
          gsap.set(card, { clearProps: 'all' })
        }
        if (right) {
          gsap.killTweensOf(right)
          gsap.set(right, { clearProps: 'all' })
        }
      })

      const s4CardEls = Array.from(document.querySelectorAll<HTMLElement>('.s4-card'))
      s4CardEls.forEach((cardEl) => {
        const s4Rotate = cardEl.querySelector<HTMLElement>('.atropos-inner')
        const atroposRotate = cardEl.querySelector<HTMLElement>('.atropos-rotate')
        if (s4Rotate) {
          gsap.killTweensOf(s4Rotate)
          gsap.set(s4Rotate, { rotationX: 0, rotationY: 0, clearProps: 'transform' })
        }
        if (atroposRotate) {
          gsap.killTweensOf(atroposRotate)
          gsap.set(atroposRotate, { rotationX: 0, rotationY: 0, clearProps: 'transform' })
        }
      })

      const sectionEl = document.querySelector<HTMLElement>('.section-4')
      const wrapperEl = document.querySelector<HTMLElement>('.s4-slides-wrapper')
      if (sectionEl) {
        sectionEl.style.height = ''
        sectionEl.style.minHeight = ''
      }
      if (wrapperEl) {
        wrapperEl.style.height = ''
        wrapperEl.style.transform = ''
      }
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section id="platform" className="section-4">
      <div className="s4-slides-wrapper">
        <div className="s4-slide slide1" data-slide="0">
          <div className="s4-left">
            <Atropos className="s4-card" highlight={false} shadow={false} rotateTouch={false}>
              <svg className="dashed-border-svg" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="25" ry="25" fill="none" stroke="#D71789" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" />
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
              <li><span>Expert-verified POIs &amp; real-time prices</span></li>
              <li><span>Dynamic itinerary optimization &amp; budget tracking</span></li>
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
            <Atropos className="s4-card two" highlight={false} shadow={false} rotateTouch={false}>
              <svg className="dashed-border-svg" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="25" ry="25" fill="none" stroke="#D71789" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" />
              </svg>
              <div className="photo-card">
                <Image src="/assets/images/brain-tourist-places.webp" className="card-img slide2-img" alt="Brain Indian Tourist Places" width={320} height={420} style={{ width: '100%', height: '100%' }} />
              </div>
              <div className="city-badge city-badge2">
                <span className="imgs">
                  <Image src="/assets/images/dark-mountains.png" width={47} height={47} alt="Travel planning" />
                  <Image src="/assets/images/tower.png" width={47} height={47} alt="Travel planning" />
                </span>
                <span className="textsl2">
                  <span>VISITED</span>
                  <span>Already visited<br />299 places</span>
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
              <span className="s4-tag purple">
                <Image src="/assets/icons/s4-tag-purple-adaptive.svg" alt="" width={13} height={10} />
                Adaptive
              </span>
              <span className="s4-tag yellow">
                <Image src="/assets/icons/s4-tag-yellow-memory.svg" alt="" width={11} height={12} />
                Context memory
              </span>
              <span className="s4-tag pink">
                <Image src="/assets/icons/s4-tag-pink-understands.svg" alt="" width={13} height={13} />
                Understands Intent
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
                <Image src="/assets/images/slider-msg-2.svg" alt="" width={190} height={80} style={{ width: 'auto', height: 'auto' }} />
                <Image src="/assets/images/circle-loc-2.png" alt="" width={76} height={76} style={{ width: 'auto', height: 'auto' }} />
                <Image src="/assets/images/slider-bali-loc.svg" alt="" width={165} height={70} style={{ width: 'auto', height: 'auto' }} />
                <Image src="/assets/images/899-more-locations.svg" alt="" width={145} height={60} style={{ width: 'auto', height: 'auto' }} />
                <Image src="/assets/images/slider-msg1.svg" alt="" width={175} height={70} style={{ width: 'auto', height: 'auto' }} />
                <Image src="/assets/images/slider-eiffil-tag.svg" alt="" width={165} height={60} style={{ width: 'auto', height: 'auto' }} />
                <Image src="/assets/images/star-loc.png" alt="" width={64} height={64} style={{ width: 'auto', height: 'auto' }} />
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
