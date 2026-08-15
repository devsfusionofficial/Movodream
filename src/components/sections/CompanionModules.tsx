'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Atropos from 'atropos/react'
import 'atropos/css'

const MODULES = [
  {
    label: '[ MODULE 01 ]',
    title: 'Conversational Travel Search',
    features: ['Search by intent, not keywords.', "Ask like you'd ask a friend.", 'AI delivers expert-verified answers with real-time availability.'],
  },
  {
    label: '[ MODULE 02 ]',
    title: 'Adaptive Trip Planning + Booking',
    features: ['Turn ideas into itineraries.', 'Book flights, stays, experiences — all in one conversation.', 'Includes: 360° previews | AR/VR navigation | Real-time updates'],
  },
  {
    label: '[ MODULE 03 ]',
    title: 'Full Journey Companion with Live Guidance',
    features: ['Gate changes, bookings, local tips, AR navigation.', 'Real-time updates from departure to destination.', 'Every recommendation verified by locals.'],
  },
]

/**
 * Ported from index.html's "how-it-works" section + script.js lines
 * 1662–2085.
 *
 * The 9s auto-advance is restored (client request): the slideshow cycles
 * module 1 -> 2 -> 3 -> 1 once the section scrolls into view, and the active
 * module's top border fills as a countdown. Manual navigation — clicking a
 * module, or the prev/next arrows — restarts that countdown rather than
 * stopping it.
 *
 * Module 2's card stack is the one thing that stays user-driven. Its original
 * `repeat: -1` timeline shuffled cards to the front forever, which was
 * restless next to an already-cycling slideshow; hovering a card does the
 * same thing on demand (see initSlide2Hover).
 */
export function CompanionModules() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const slides = document.querySelectorAll<HTMLElement>('.how-slide')
    const modules = document.querySelectorAll<HTMLElement>('.modules-section .module')
    if (!slides.length || !modules.length) return

    // Seconds each slide holds before advancing — matches the original site's
    // SLIDE_DURATION (script.js:1665).
    const SLIDE_DURATION = 9

    let current = 0
    let elapsed = 0
    let slideshowTimer: ((time: number) => void) | null = null

    function initSlide2Hover() {
      const cards = document.querySelectorAll<HTMLElement>('.hs2-card')
      const rest = [
        { x: -22, y: -22, rotation: -4, autoAlpha: 0.85, scale: 1, zIndex: 1 },
        { x: -11, y: -11, rotation: -2, autoAlpha: 0.95, scale: 1, zIndex: 2 },
        { x: 0, y: 0, rotation: 0, autoAlpha: 1.0, scale: 1, zIndex: 3 },
      ]
      cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
          cards.forEach((c, j) => {
            if (j === i) return
            gsap.to(c, { autoAlpha: 0.2, scale: 0.92, duration: 0.3, ease: 'power2.out', overwrite: true })
          })
          gsap.to(card, { x: 0, y: 0, rotation: 0, autoAlpha: 1, scale: 1.05, zIndex: 10, duration: 0.38, ease: 'back.out(1.7)', overwrite: true })
        })
        card.addEventListener('mouseleave', () => {
          cards.forEach((c, j) => {
            gsap.to(c, { ...rest[j], duration: 0.44, ease: 'power2.inOut', overwrite: true })
          })
        })
      })
    }

    function animateSlide1() {
      const bubble1 = document.querySelector('.bubble-1')
      const bubble2 = document.querySelector('.bubble-2')
      const avatar = document.querySelector('.user-avatar')

      gsap.killTweensOf(['.chat-interface', bubble1, bubble2, avatar])
      gsap.set([bubble1, bubble2, avatar], { autoAlpha: 1, scale: 1 })

      gsap
        .timeline()
        .from('.circle-wrapper', { scale: 0.8, duration: 0.6, opacity: 0.5, ease: 'power2.out' })
        .fromTo(avatar, { autoAlpha: 0, x: 20, scale: 0.8 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.3')
        .fromTo(bubble1, { autoAlpha: 0, y: 12, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.1')
        .fromTo(bubble2, { autoAlpha: 0, y: 12, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '+=0.1')
    }

    function animateSlide2() {
      const back = document.querySelector<HTMLElement>('.hs2-card--back')
      const mid = document.querySelector<HTMLElement>('.hs2-card--mid')
      const front = document.querySelector<HTMLElement>('.hs2-card--front')
      const frontContent = document.querySelectorAll('.hs2-card--front .hs2-title, .hs2-card--front .hs2-body, .hs2-card--front .hs2-icon')
      if (!back || !mid || !front) return

      gsap.killTweensOf([back, mid, front])
      gsap.set([back, mid, front], { autoAlpha: 0, y: 80, x: 0, rotation: 0, scale: 0.82, transformOrigin: 'center bottom' })
      gsap.set(frontContent, { autoAlpha: 0, y: 14 })

      // Card stack settles here and stays put — no more auto-cycling back/mid
      // to the front on a timer. initSlide2Hover() below already gives the
      // same "bring a card forward" effect, driven by the user hovering it.
      gsap
        .timeline()
        .to(back, { autoAlpha: 0.45, y: -22, x: -22, rotation: -4, scale: 1, duration: 0.6, ease: 'back.out(1.8)' })
        .to(mid, { autoAlpha: 0.65, y: -11, x: -11, rotation: -2, scale: 1, duration: 0.54, ease: 'back.out(1.8)' }, '-=0.34')
        .to(front, { autoAlpha: 1, y: 0, x: 0, rotation: 0, scale: 1, duration: 0.6, ease: 'back.out(1.9)' }, '-=0.3')
        .to(frontContent, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.1, ease: 'power2.out' }, '-=0.14')
    }

    function animateSlide3() {
      const card = document.querySelector('.hs3-companion-card')
      const msgs = document.querySelectorAll('.hs3-msg')
      const stats = document.querySelectorAll('.hs3-stat')

      gsap.set(card, { autoAlpha: 0, y: 30, scale: 0.9 })
      gsap.set(msgs, { autoAlpha: 0, x: -20 })
      gsap.set(stats, { autoAlpha: 0, y: 20 })

      gsap
        .timeline()
        .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' })
        .to(msgs, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.18, ease: 'power3.out' }, '-=0.1')
        .to(stats, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'back.out(2)' }, '-=0.2')
        .call(
          () => {
            document.querySelectorAll<HTMLElement>('.hs3-num').forEach((el) => {
              const raw = el.textContent?.trim() ?? ''
              const num = parseFloat(raw)
              if (isNaN(num)) return
              const suffix = raw.replace(String(num), '')
              gsap.fromTo(
                el,
                { textContent: 0 },
                {
                  textContent: num,
                  duration: 1.2,
                  ease: 'power2.out',
                  snap: { textContent: 1 },
                  onUpdate() {
                    el.textContent = `${Math.round(Number(el.textContent))}${suffix}`
                  },
                }
              )
            })
          },
          undefined,
          '-=0.8'
        )
    }

    const animators = [animateSlide1, animateSlide2, animateSlide3]

    function goTo(idx: number) {
      slides[current].classList.remove('active')
      modules[current].classList.remove('active')
      modules[current].style.removeProperty('--timer-pct')

      current = idx
      elapsed = 0

      slides[current].classList.add('active')
      modules[current].classList.add('active')

      animators[current]?.()
    }

    // Auto-advance, driven off gsap's ticker (in seconds) so it stays in step
    // with the slide animations and pauses with the rest of GSAP when the tab
    // is backgrounded. Also publishes progress as --timer-pct, which the
    // active module's top border renders as a countdown fill.
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
        modules[current].style.setProperty('--timer-pct', `${pct}%`)
        if (elapsed >= SLIDE_DURATION) goTo((current + 1) % slides.length)
      }
      gsap.ticker.add(slideshowTimer)
    }

    function stopSlideshowTimer() {
      if (slideshowTimer) {
        gsap.ticker.remove(slideshowTimer)
        slideshowTimer = null
      }
    }

    // Any manual navigation restarts the countdown from zero, so a slide the
    // user just chose always gets its full dwell time rather than inheriting
    // whatever was left on the previous one's clock.
    function goToManually(idx: number) {
      stopSlideshowTimer()
      goTo(idx)
      startSlideshowTimer()
    }

    function resetSlideshow() {
      stopSlideshowTimer()
      gsap.killTweensOf(
        [
          '.chat-interface',
          '.circle-wrapper',
          '.bubble-1',
          '.bubble-2',
          '.user-avatar',
          document.querySelector('.hs2-card--back'),
          document.querySelector('.hs2-card--mid'),
          document.querySelector('.hs2-card--front'),
          '.hs3-companion-card',
          '.hs3-msg',
          '.hs3-stat',
        ].filter(Boolean)
      )
      slides[current].classList.remove('active')
      modules[current].classList.remove('active')
      modules[current].style.removeProperty('--timer-pct')
      current = 0
      elapsed = 0
    }

    const moduleClickHandlers: Array<() => void> = []
    modules.forEach((mod, i) => {
      const handler = () => goToManually(i)
      moduleClickHandlers.push(handler)
      mod.addEventListener('click', handler)
    })

    initSlide2Hover()

    // Initialize slide 0 immediately on mount so content is visible right away
    goTo(0)
    startSlideshowTimer()

    const enterTrigger = ScrollTrigger.create({
      trigger: '.how-it-works',
      scroller: document.body,
      start: 'top 75%',
      onEnter: () => {
        resetSlideshow()
        goTo(0)
        startSlideshowTimer()
      },
      onEnterBack: () => {
        resetSlideshow()
        goTo(0)
        startSlideshowTimer()
      },
    })

    const prevArrow = document.querySelector('.hiw-arrow--prev')
    const nextArrow = document.querySelector('.hiw-arrow--next')
    const onPrev = () => goToManually((current - 1 + slides.length) % slides.length)
    const onNext = () => goToManually((current + 1) % slides.length)
    prevArrow?.addEventListener('click', onPrev)
    nextArrow?.addEventListener('click', onNext)

    return () => {
      stopSlideshowTimer()
      enterTrigger.kill()
      prevArrow?.removeEventListener('click', onPrev)
      nextArrow?.removeEventListener('click', onNext)
      modules.forEach((mod, i) => mod.removeEventListener('click', moduleClickHandlers[i]))
    }
  }, [])

  return (
    <section id="ecosystem" className="how-it-works">
      <div className="wrapper">
        <header className="header-section">
          <h1 className="main-title">Your AI Companion in Action</h1>
        </header>

        <div className="feature-card-wrapper">
          <div className="feature-card">
            <div className="how-it-works-arrows">
              <button type="button" className="hiw-arrow hiw-arrow--prev" aria-label="Previous module">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#f5f5f5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="hiw-arrow hiw-arrow--next" aria-label="Next module">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#f5f5f5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="how-waves-wrapper">
              <Image className="how-waves" src="/assets/images/how-waves.webp" alt="waves" width={800} height={300} style={{ width: '100%', height: 'auto' }} />
            </div>

            {/* SLIDE 1 */}
            <div className="how-slide how-slide-1 active">
              <div className="circle-wrapper">
                <svg className="dashed-circle" width="100%" viewBox="0 0 494 494" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="247" cy="247" r="246.25" stroke="#D71789" strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="10 6" />
                </svg>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="dashed-circle2" width="80%" src="/assets/icons/s4-dashed-circle-2.svg" alt="" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="dashed-circle3" width="76%" src="/assets/icons/s4-dashed-circle-3.svg" alt="" />
                <div className="circle-images-container">
                  <Image src="/assets/images/slider-msg-2.svg" alt="" width={190} height={80} />
                  <Image src="/assets/images/circle-loc-2.png" alt="" width={76} height={76} />
                  <Image src="/assets/images/slider-bali-loc.svg" alt="" width={165} height={70} />
                  <Image src="/assets/images/899-more-locations-white.svg" alt="" width={145} height={60} />
                  <Image src="/assets/images/slider-msg1.svg" alt="" width={175} height={70} />
                  <Image src="/assets/images/slider-eiffil-tag.svg" alt="" width={165} height={60} />
                  <Image src="/assets/images/star-loc.png" alt="" width={56} height={56} />
                </div>
              </div>

              <div className="chat-interface">
                <div className="user-avatar">
                  <Image src="/assets/images/user-avatar.jpg" alt="User" width={45} height={45} />
                </div>
                <div className="chat-bubbles">
                  <div className="bubble bubble-1">
                    <span className="text">Places similar to Bali but cheaper?</span>
                    <span className="icon">
                      <Image src="/assets/icons/bubble-pencil.svg" alt="" width={16} height={16} />
                    </span>
                  </div>
                  <div className="bubble bubble-2">
                    <span className="text">Where can I go with good weather right now?</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 2 */}
            <div className="how-slide how-slide-2">
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

            {/* SLIDE 3 */}
            <div className="how-slide how-slide-3">
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
        </div>

        <section className="modules-section">
          {MODULES.map((mod, i) => (
            <div key={mod.title} className={`module module-${i + 1}`}>
              <span className="module-label">{mod.label}</span>
              <h3>{mod.title}</h3>
              <ul className="feature-list">
                {mod.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}
