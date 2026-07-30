'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { homepageScrollState } from '@/lib/homepage-scroll-state'

const POINTS = [
  {
    title: 'End-to-End Intelligence',
    desc: 'From discovery to booking to on-ground support, everything is seamlessly planned and connected for you — powered by real-time API orchestration and dynamic workflow engines.',
  },
  {
    title: 'Real Locals. Real Verification.',
    desc: 'Every recommendation comes from trusted locals and is carefully verified for authenticity — driven by an AI-based verification layer with human-in-the-loop validation.',
  },
  {
    title: 'Works Everywhere, Instantly.',
    desc: 'Access travel insights, plans, and support anytime, anywhere, without friction — enabled by cloud-native architecture, edge caching, and offline-first sync',
  },
  {
    title: 'Anywhere You Go',
    desc: 'No matter the destination, your travel experience stays personalized and reliable — backed by geo-distributed infrastructure and automatic failover.',
  },
  {
    title: 'One Connection to Everything',
    desc: 'Flights, stays, experiences, and experts — all brought together in one unified platform through a GraphQL federation layer integrating multiple data sources.',
  },
  {
    title: 'Gets Smarter Every Trip',
    desc: 'With every journey, the platform learns your preferences to deliver better, more tailored experiences — continuously improved via ML pipelines, behavioral analytics, and user feedback loops.',
  },
]

const EMOJIS = [
  { emoji: '🧠', extraClass: 'icon1' },
  { emoji: '✅', extraClass: 'icon2' },
  { emoji: '⚡', extraClass: '' },
  { emoji: '🌐', extraClass: '' },
  { emoji: '🔗', extraClass: 'icon5' },
  { emoji: '💡', extraClass: '' },
]

const TOTAL_POINTS = 6

/**
 * Ported from index.html's section-5 + script.js lines 679–837. The ring's
 * position math lives entirely in CSS (`--i` per emoji, see homepage.css)
 * — this component only drives which point is "active" and the
 * `--extra-rot` custom property that keeps the active emoji visually
 * sticky at the top of the ring while it rotates (formula: `60°*idx -
 * 300°*progress`, ported verbatim). Desktop and mobile get separate
 * ScrollTrigger pins via gsap.matchMedia, matching the original — mobile's
 * pin start position depends on `homepageScrollState.cardExpanded`, set by
 * ImmersiveBooking (see lib/homepage-scroll-state.ts).
 */
export function AdvantageArc() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section5 = document.querySelector<HTMLElement>('.section-5')
    const contentCircle = document.querySelector<HTMLElement>('.content-circle')
    const circlePoints = document.querySelectorAll<HTMLElement>('.circle-point')
    const ringEmojis = document.querySelectorAll<HTMLElement>('.ring-emoji')
    if (!section5 || !contentCircle) return

    let s5ActiveIndex = -1

    function setCircleActive(idx: number) {
      if (idx === s5ActiveIndex) return
      s5ActiveIndex = idx

      circlePoints.forEach((pt, i) => pt.classList.toggle('active', i === idx))
      ringEmojis.forEach((emoji, i) => emoji.classList.toggle('active', i === idx))

      const newActivePoint = circlePoints[idx]
      const h3 = newActivePoint?.querySelector('h3')
      if (h3) {
        gsap.killTweensOf(h3)
        gsap.fromTo(
          h3,
          { transform: 'translateX(-139%) translateY(241%) rotate(-47deg)', opacity: 0 },
          { transform: 'translateX(0%) translateY(0%) rotate(0deg)', opacity: 1, duration: 0.6, ease: 'power3.out', overwrite: true }
        )
      }
    }

    setCircleActive(0)
    ringEmojis.forEach((emoji) => emoji.style.setProperty('--extra-rot', '0deg'))

    const s5MM = gsap.matchMedia()

    s5MM.add('(min-width: 769px)', () => {
      const s5Tween = gsap.to(contentCircle, {
        rotation: 300,
        ease: 'none',
        scrollTrigger: {
          trigger: section5,
          scroller: document.body,
          start: 'top top',
          end: '+=480%',
          pin: true,
          scrub: true,
          pinSpacing: true,
          refreshPriority: -1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.min(Math.floor(self.progress * TOTAL_POINTS), TOTAL_POINTS - 1)
            setCircleActive(idx)

            const progress = self.progress
            const extraRotation = 60 * idx - 300 * progress
            ringEmojis.forEach((emoji, i) => {
              if (i === idx) {
                emoji.style.setProperty('--extra-rot', `${extraRotation}deg`)
              } else if (emoji.style.getPropertyValue('--extra-rot') !== '0deg') {
                emoji.style.setProperty('--extra-rot', '0deg')
              }
            })
          },
        },
      })

      return () => {
        s5Tween.scrollTrigger?.kill()
        s5Tween.kill()
      }
    })

    s5MM.add('(max-width: 768px)', () => {
      let lastIdxM = -1
      let activeEmojiEl: HTMLElement | null = null
      let lastExtraRot: number | null = null

      const s5TweenM = gsap.to(contentCircle, {
        rotation: 300,
        ease: 'none',
        scrollTrigger: {
          trigger: section5,
          scroller: document.body,
          start: () => (homepageScrollState.cardExpanded ? 'top 0%' : 'top -80%'),
          end: '+=350%',
          pin: true,
          scrub: true,
          pinType: 'transform',
          pinSpacing: true,
          refreshPriority: -1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate(self) {
            let target = Math.min(Math.floor(self.progress * TOTAL_POINTS), TOTAL_POINTS - 1)
            if (lastIdxM !== -1 && Math.abs(target - lastIdxM) > 1) {
              target = lastIdxM + Math.sign(target - lastIdxM)
            }
            const idx = target
            if (idx !== lastIdxM) {
              lastIdxM = idx
              setCircleActive(idx)
              activeEmojiEl = ringEmojis[idx]
              ringEmojis.forEach((emoji, i) => {
                if (i !== idx) emoji.style.setProperty('--extra-rot', '0deg')
              })
              lastExtraRot = null
            }
            if (activeEmojiEl) {
              const extraRotation = 60 * idx - 300 * self.progress
              if (lastExtraRot === null || Math.abs(extraRotation - lastExtraRot) > 0.2) {
                activeEmojiEl.style.setProperty('--extra-rot', `${extraRotation}deg`)
                lastExtraRot = extraRotation
              }
            }
          },
        },
      })

      return () => {
        s5TweenM.scrollTrigger?.kill()
        s5TweenM.kill()
      }
    })

    return () => {
      s5MM.revert()
    }
  }, [])

  return (
    <section id="advantage" className="section-5">
      <h2 className="s5-heading">Movodream Advantage</h2>
      <p className="sub">Not just AI, Local experts too. That&apos;s the Movodream difference.</p>

      <div className="s5-content">
        <div className="circle-label-slot">
          {POINTS.map((point, i) => (
            <div key={point.title} className="circle-point" data-index={i}>
              <h3>{point.title}</h3>
              <p className="point-desc">{point.desc}</p>
            </div>
          ))}
        </div>

        <div className="circle-connector" />

        <div className="content-circle">
          {EMOJIS.map((item, i) => (
            <span
              key={i}
              className={`ring-emoji${item.extraClass ? ` ${item.extraClass}` : ''}`}
              data-dot={i}
              style={{ '--i': i } as React.CSSProperties}
            >
              {item.emoji}
              <span className="emoji-num">{i + 1}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
