'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Monochrome Font Awesome icons rather than emoji: emoji render in their
// own fixed colours (green tick, blue globe, yellow bulb), which clashed
// against the pink brand badge.
//
// `art` points at the 3D illustration for each card. Cards render fine
// without it (text-only), so the section is not broken while the artwork
// is still being produced — drop a file in public/assets/advantage/ and
// set the filename here to light it up.
type Point = {
  icon: string
  title: string
  desc: string
  art?: string
}

const POINTS: Point[] = [
  {
    icon: 'fa-brain',
    art: 'brain.svg',
    title: 'End-to-End Intelligence',
    desc: 'From discovery to booking to on-ground support, everything is seamlessly planned and connected for you — powered by real-time API orchestration and dynamic workflow engines.',
  },
  {
    icon: 'fa-shield-halved',
    art: 'verified.svg',
    title: 'Real Locals. Real Verification.',
    desc: 'Every recommendation comes from trusted locals and is carefully verified for authenticity — driven by an AI-based verification layer with human-in-the-loop validation.',
  },
  {
    icon: 'fa-bolt',
    art: 'globe.svg',
    title: 'Works Everywhere, Instantly.',
    desc: 'Access travel insights, plans, and support anytime, anywhere, without friction — enabled by cloud-native architecture, edge caching, and offline-first sync.',
  },
  {
    icon: 'fa-globe',
    art: 'journey.svg',
    title: 'Anywhere You Go',
    desc: 'No matter the destination, your travel experience stays personalized and reliable — backed by geo-distributed infrastructure and automatic failover.',
  },
  {
    icon: 'fa-link',
    art: 'hub.svg',
    title: 'One Connection to Everything',
    desc: 'Flights, stays, experiences, and experts — all brought together in one unified platform through a GraphQL federation layer integrating multiple data sources.',
  },
  {
    icon: 'fa-lightbulb',
    art: 'growth.svg',
    title: 'Gets Smarter Every Trip',
    desc: 'With every journey, the platform learns your preferences to deliver better, more tailored experiences — continuously improved via ML pipelines, behavioral analytics, and user feedback loops.',
  },
]

const TRUST = [
  { icon: 'fa-lock', title: 'Privacy First', desc: 'Your data is protected with end-to-end encryption.' },
  { icon: 'fa-shield-halved', title: 'Secure & Trusted', desc: 'Bank-grade security for all your transactions.' },
  { icon: 'fa-headset', title: '24/7 Support', desc: 'Real people. Real help. Whenever you need it.' },
  { icon: 'fa-star', title: 'Built for Travelers', desc: 'Designed with love for the way you explore.' },
]

/**
 * "Movodream Advantage" — rebuilt to the client's design mock: eyebrow
 * pill, split-colour heading, ruled subtitle, six illustrated cards and a
 * trust bar. Cards fade/slide in once on scroll — no pinning, no
 * scroll-jacking (the original pinned emoji ring caused real layout bugs).
 */
export function AdvantageGrid() {
  const [activeAdvIndex, setActiveAdvIndex] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const handleScroll = () => {
      const card = el.firstElementChild as HTMLElement
      if (!card) return
      const cardWidth = card.getBoundingClientRect().width + 14
      const index = Math.round(el.scrollLeft / cardWidth)
      setActiveAdvIndex(Math.min(Math.max(index, 0), POINTS.length - 1))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToCard = (index: number) => {
    const el = gridRef.current
    if (!el) return
    const card = el.children[index] as HTMLElement
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cards = gsap.utils.toArray<HTMLElement>('.advantage-card')
    if (!cards.length) return

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.advantage-grid',
        scroller: document.body,
        start: 'top 80%',
        once: true,
      },
    })
  }, [])

  return (
    <section id="advantage" className="advantage-section">
      <div className="advantage-header">
        <span className="advantage-eyebrow">
          <i className="fa-solid fa-star" />
          Why Movodream
        </span>
        <h2>
          Movodream <span className="advantage-heading-accent">Advantage</span>
        </h2>
        <div className="advantage-subrow">
          <span className="advantage-rule" />
          <p className="sub">
            Not just AI, Local experts too. That&apos;s the <strong>Movodream difference</strong>.
          </p>
          <span className="advantage-rule" />
        </div>
      </div>

      <div className="advantage-grid" ref={gridRef}>
        {POINTS.map((point) => (
          <div key={point.title} className="advantage-card">
            <div className="advantage-card-body">
              <div className="advantage-icon">
                <i className={`fa-solid ${point.icon}`} />
              </div>
              <h3>{point.title}</h3>
              <span className="advantage-divider" />
              <p>{point.desc}</p>
            </div>
            {point.art && (
              <div className="advantage-card-art">
                <Image src={`/assets/advantage/${point.art}`} alt="" fill sizes="220px" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="advantage-slider-lines" aria-hidden="true">
        {POINTS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`advantage-line ${i === activeAdvIndex ? 'active' : ''}`}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="advantage-mobile-hint" aria-hidden="true">
        <span>Swipe to explore advantages</span>
        <i className="fa-solid fa-arrow-right-long" />
      </div>

      <div className="advantage-trust">
        {TRUST.map((item) => (
          <div key={item.title} className="advantage-trust-item">
            <span className="advantage-trust-icon">
              <i className={`fa-solid ${item.icon}`} />
            </span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
