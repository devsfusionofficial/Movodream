'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Feature copy is the client's Product summary PDF, verbatim — the full
// bullet lists, not a trimmed selection.
const FEATURES = [
  {
    slug: 'ai-travel-brain',
    num: '01',
    title: 'AI Travel Brain',
    desc: 'The context-aware AI that understands you better than any travel expert.',
    tags: [
      'Context AI',
      'Behavioral AI',
      'User Preferences',
      'Real-Time Adapt',
      'Dynamic Logic',
      'Predictive AI',
    ],
  },
  {
    slug: 'live-travel-mode',
    num: '02',
    title: 'Live Travel Mode',
    desc: 'Real-time guidance that stays with you for the whole trip, not just the booking.',
    tags: [
      'Live Navigation',
      'Real-Time Alerts',
      'Dynamic Itinerary',
      'Smart Alerts',
      'Traffic Updates',
      'Nearby Spots',
      'Emergency Help',
      'Trip Progress',
      'Context Guide',
      'Cultural Tips',
      'Voice Guides',
      'Live Translate',
    ],
  },
  {
    slug: 'booking-engine',
    num: '03',
    title: 'Integrated Booking Engine',
    desc: 'From AI recommendation to confirmed booking — in just one click.',
    tags: ['Flights & Hotels', 'Trains & Cabs', 'Buses & Rides', 'Experiences', 'Auto Sync', 'Fast Payments'],
  },
  {
    slug: 'local-guru',
    num: '04',
    title: 'Local Guru',
    desc: 'Discover authentic experiences, hidden gems and trusted local experts.',
    tags: [
      'Hidden Gems',
      'Local Experts',
      'Authentic Food',
      'Cultural Tips',
      'Nearby Spots',
      'Local Events',
      'Safety Alerts',
      'Insider Guides',
    ],
  },
  {
    slug: 'immersive-experience',
    num: '05',
    title: 'Immersive Travel Experience',
    desc: 'Experience destinations like never before with immersive & interactive technology.',
    tags: [
      '360° Previews',
      'Travel Reels',
      'Virtual Try-On',
      'Real-Time Audio',
      'History Overlays',
      'Landmark Scan',
    ],
  },
  {
    slug: 'memory-curation',
    num: '06',
    title: 'Memory Curation',
    desc: 'Every journey ends. Every memory lives on.',
    tags: [
      'AI Journal',
      'Smart Media',
      'Auto Highlights',
      'Trip Insights',
      'Timeline',
      'Places Archive',
      'Milestones',
      'Shared Albums',
    ],
  },
]

/**
 * Alternating image/text feature rows. Each row fades up once when it
 * first scrolls into view — no pinning or scroll-jacking.
 */
export function IzhingaFeatures() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const rows = gsap.utils.toArray<HTMLElement>('.izhinga-row')
    rows.forEach((row) => {
      gsap.to(row, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: row, scroller: document.body, start: 'top 85%', once: true },
      })
    })
  }, [])

  return (
    <div className="izhinga-rows">
      {FEATURES.map((feature, i) => (
        <div key={feature.slug} className={`izhinga-row${i % 2 === 1 ? ' is-reversed' : ''}`}>
          <div className="izhinga-row-media">
            <Image
              src={`/assets/product/${feature.slug}.webp`}
              alt={feature.title}
              fill
              sizes="(max-width: 900px) 100vw, 1400px"
              quality={100}
              unoptimized
            />
          </div>
          <div className="izhinga-row-body">
            <span className="izhinga-row-num">{feature.num}</span>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <ul className="izhinga-row-tags">
              {feature.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
