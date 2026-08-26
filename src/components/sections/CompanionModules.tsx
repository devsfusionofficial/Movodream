'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MODULES = [
  {
    label: '[ MODULE 01 ]',
    title: 'Conversational Travel Search',
    features: [
      'Search by intent, not keywords.',
      "Ask like you'd ask a friend.",
      'AI delivers expert-verified answers with real-time availability.',
    ],
  },
  {
    label: '[ MODULE 02 ]',
    title: 'Adaptive Trip Planning + Booking',
    features: [
      'Turn ideas into itineraries.',
      'Book flights, stays, experiences — all in one conversation.',
      'Includes: 360° previews | AR/VR navigation | Real-time updates',
    ],
  },
  {
    label: '[ MODULE 03 ]',
    title: 'Full Journey Companion with Live Guidance',
    features: [
      'Gate changes, bookings, local tips, AR navigation.',
      'Real-time updates from departure to destination.',
      'Every recommendation verified by locals.',
    ],
  },
]

export function CompanionModules() {
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)

  // Keep ref in sync for timer callbacks
  currentRef.current = current

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const SLIDE_DURATION = 9
    let elapsed = 0
    let slideshowTimer: ((time: number) => void) | null = null

    function updateActiveUI(idx: number) {
      setCurrent(idx)
      const slides = document.querySelectorAll<HTMLElement>('.how-slide')
      const modules = document.querySelectorAll<HTMLElement>('.module')

      slides.forEach((s, i) => {
        if (i === idx) s.classList.add('active')
        else s.classList.remove('active')
      })

      modules.forEach((m, i) => {
        if (i === idx) {
          m.classList.add('active')
        } else {
          m.classList.remove('active')
          m.style.removeProperty('--timer-pct')
        }
      })
    }

    function goTo(idx: number) {
      currentRef.current = idx
      elapsed = 0
      updateActiveUI(idx)
    }

    function startSlideshowTimer() {
      if (slideshowTimer) return
      let lastTime: number | null = null
      slideshowTimer = (time: number) => {
        if (lastTime === null) {
          lastTime = time
          return
        }
        elapsed += time - lastTime
        lastTime = time
        const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100)

        const activeModule = document.querySelector<HTMLElement>(`.module.module-${currentRef.current + 1}`)
        if (activeModule) {
          activeModule.style.setProperty('--timer-pct', `${pct}%`)
        }

        if (elapsed >= SLIDE_DURATION) {
          const next = (currentRef.current + 1) % MODULES.length
          goTo(next)
        }
      }
      gsap.ticker.add(slideshowTimer)
    }

    function stopSlideshowTimer() {
      if (slideshowTimer) {
        gsap.ticker.remove(slideshowTimer)
        slideshowTimer = null
      }
    }

    // Expose manual navigation function to window for click handlers
    ;(window as unknown as { __hiwGoTo?: (idx: number) => void }).__hiwGoTo = (idx: number) => {
      stopSlideshowTimer()
      goTo(idx)
      startSlideshowTimer()
    }

    goTo(0)
    startSlideshowTimer()

    const enterTrigger = ScrollTrigger.create({
      trigger: '.how-it-works',
      scroller: document.body,
      start: 'top 75%',
      onEnter: () => {
        stopSlideshowTimer()
        goTo(0)
        startSlideshowTimer()
      },
      onEnterBack: () => {
        stopSlideshowTimer()
        goTo(0)
        startSlideshowTimer()
      },
    })

    return () => {
      stopSlideshowTimer()
      enterTrigger.kill()
      delete (window as unknown as { __hiwGoTo?: unknown }).__hiwGoTo
    }
  }, [])

  const goToManually = (idx: number) => {
    const fn = (window as unknown as { __hiwGoTo?: (idx: number) => void }).__hiwGoTo
    if (fn) {
      fn(idx)
    } else {
      setCurrent(idx)
    }
  }

  return (
    <section id="ecosystem" className="how-it-works">
      <div className="wrapper">
        <header className="header-section">
          <h1 className="main-title">Your AI Companion in Action</h1>
        </header>

        <div className="feature-card-wrapper">
          <div className="feature-card">
            {/* Visual Pane (Left on Desktop, Main Card on Mobile) */}
            <div className="hiw-visual-pane">
              <div className="how-waves-wrapper">
                <Image
                  className="how-waves"
                  src="/assets/images/how-waves.webp"
                  alt="waves"
                  width={800}
                  height={300}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>

              {/* Mobile Arrows */}
              <div className="how-it-works-arrows">
                <button
                  type="button"
                  className="hiw-arrow hiw-arrow--prev"
                  aria-label="Previous module"
                  onClick={() => goToManually((current - 1 + MODULES.length) % MODULES.length)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#f5f5f5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="hiw-arrow hiw-arrow--next"
                  aria-label="Next module"
                  onClick={() => goToManually((current + 1) % MODULES.length)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#f5f5f5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* SLIDE 1 (Moving Circle) */}
              <div className={`how-slide how-slide-1 ${current === 0 ? 'active' : ''}`}>
                <div className="circle-wrapper">
                  <svg className="dashed-circle" width="100%" viewBox="0 0 494 494" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="247" cy="247" r="246.25" stroke="#D71789" strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="10 6" />
                  </svg>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="dashed-circle2" width="80%" src="/assets/icons/s4-dashed-circle-2.svg" alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="dashed-circle3" width="76%" src="/assets/icons/s4-dashed-circle-3.svg" alt="" />
                  <div className="circle-images-container">
                    <Image src="/assets/images/slider-msg-2.svg" alt="" width={190} height={80} style={{ width: 'auto', height: 'auto' }} />
                    <Image src="/assets/images/circle-loc-2.png" alt="" width={76} height={76} style={{ width: 'auto', height: 'auto' }} />
                    <Image src="/assets/images/slider-bali-loc.svg" alt="" width={165} height={70} style={{ width: 'auto', height: 'auto' }} />
                    <Image src="/assets/images/899-more-locations-white.svg" alt="" width={145} height={60} style={{ width: 'auto', height: 'auto' }} />
                    <Image src="/assets/images/slider-msg1.svg" alt="" width={175} height={70} style={{ width: 'auto', height: 'auto' }} />
                    <Image src="/assets/images/slider-eiffil-tag.svg" alt="" width={165} height={60} style={{ width: 'auto', height: 'auto' }} />
                    <Image src="/assets/images/star-loc.png" alt="" width={56} height={56} style={{ width: 'auto', height: 'auto' }} />
                  </div>
                </div>
              </div>

              {/* SLIDE 2 (Cards - used on mobile) */}
              <div className={`how-slide how-slide-2 ${current === 1 ? 'active' : ''}`}>
                <div className="hs2-stack-wrapper">
                  <div className="hs2-card hs2-card--back">
                    <span className="hs2-dots">◆◆◆◆</span>
                    <p className="hs2-title">Plans that actually listen</p>
                    <p className="hs2-body">Tell us your vibe — we remember and adapt every detail.</p>
                    <Image className="hs2-icon" src="/assets/icons/hs2-icon-1.svg" alt="" width={36} height={30} />
                  </div>
                  <div className="hs2-card hs2-card--mid">
                    <span className="hs2-dots">◆◆◆◆</span>
                    <p className="hs2-title">Real-time magic</p>
                    <p className="hs2-body">Flight delayed? Swap an activity. Changes cascade automatically.</p>
                    <Image className="hs2-icon" src="/assets/icons/hs2-icon-2.svg" alt="" width={36} height={36} />
                  </div>
                  <div className="hs2-card hs2-card--front">
                    <span className="hs2-dots">◆◆◆◆</span>
                    <p className="hs2-title">Your trip. Your rules.</p>
                    <p className="hs2-body">Budget shift? Group vote? Sudden craving for ramen at 2 AM? We adapt without judgment.</p>
                    <Image className="hs2-icon" src="/assets/icons/hs2-icon-3.svg" alt="" width={36} height={41} />
                  </div>
                </div>
              </div>

              {/* SLIDE 3 (Live Companion - used on mobile) */}
              <div className={`how-slide how-slide-3 ${current === 2 ? 'active' : ''}`}>
                <div className="hs3-wrapper">
                  <div className="hs3-companion-card">
                    <div className="hs3-top">
                      <span className="hs3-label">Your AI Companion</span>
                      <span className="hs3-status">● Live</span>
                    </div>
                    <div className="hs3-messages">
                      <div className="hs3-msg hs3-msg--ai">Your gate changed to B12 — I&apos;ve updated your timeline ✓</div>
                      <div className="hs3-msg hs3-msg--ai">Taxi booked for 08:40 AM. Estimated cost: $14</div>
                      <div className="hs3-msg hs3-msg--user">Find me a good coffee near the hotel</div>
                      <div className="hs3-msg hs3-msg--ai">3 cafés within 200m — Café Nero is highest rated ☕</div>
                    </div>
                  </div>
                  <div className="hs3-stats">
                    <div className="hs3-stat">
                      <span className="hs3-num">24/7</span>
                      <span className="hs3-lbl">Support</span>
                    </div>
                    <div className="hs3-stat">
                      <span className="hs3-num">80+</span>
                      <span className="hs3-lbl">Cities</span>
                    </div>
                    <div className="hs3-stat">
                      <span className="hs3-num">∞</span>
                      <span className="hs3-lbl">Adaptations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Active Module Showcase Pane */}
            <div className="hiw-modules-pane">
              {/* Stepper Action Buttons Navigation */}
              <div className="modules-stepper">
                <button
                  type="button"
                  className="stepper-arrow stepper-arrow--up"
                  aria-label="Previous module"
                  onClick={() => goToManually((current - 1 + MODULES.length) % MODULES.length)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <div className="stepper-dots">
                  {MODULES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`stepper-dot ${current === i ? 'active' : ''}`}
                      aria-label={`Go to module ${i + 1}`}
                      onClick={() => goToManually(i)}
                    >
                      <span className="stepper-num">0{i + 1}</span>
                      <span className="stepper-line" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="stepper-arrow stepper-arrow--down"
                  aria-label="Next module"
                  onClick={() => goToManually((current + 1) % MODULES.length)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Viewport for Vertical Slide */}
              <div className="modules-viewport">
                <div
                  className="modules-track"
                  style={{ transform: `translateY(-${current * 100}%)` }}
                >
                  {MODULES.map((mod, i) => (
                    <div
                      key={mod.title}
                      className={`module module-${i + 1} ${current === i ? 'active' : ''}`}
                      onClick={() => goToManually(i)}
                    >
                      <div className="module-inner-card">
                        <span className="module-label">{mod.label}</span>
                        <h3>{mod.title}</h3>
                        <ul className="feature-list">
                          {mod.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
