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
      'Context Awareness',
      'Behavioral Intelligence',
      'Preference Learning',
      'Real-Time Adaption',
      'Dynamic Decision Making',
      'Predictive Recommendations',
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
      'Dynamic Itinerary Updates',
      'Smart Notifications',
      'Traffic & Weather Intelligence',
      'Nearby Recommendations',
      'Emergency Assistance',
      'Trip Progress Tracking',
      'Context-Aware Travel Guidance',
      'Cultural Guidance',
      'GPS Voice Guides',
      'Translations',
    ],
  },
  {
    slug: 'booking-engine',
    num: '03',
    title: 'Integrated Booking Engine',
    desc: 'From AI recommendation to confirmed booking — in just one click.',
    tags: ['Flights', 'Hotels', 'Trains', 'Cabs', 'Buses', 'Experiences', 'Sync', 'Payments'],
  },
  {
    slug: 'local-guru',
    num: '04',
    title: 'Local Guru',
    desc: 'Discover authentic experiences, hidden gems and trusted local experts.',
    tags: [
      'Hidden Gems',
      'Local Recommendations',
      'Authentic Food Discovery',
      'Cultural Insights',
      'Nearby Experiences',
      'Shopping Suggestions',
      'Local Events',
      'Safety Tips',
      'Personalized Discovery',
      'Insider Travel Intelligence',
    ],
  },
  {
    slug: 'immersive-experience',
    num: '05',
    title: 'Immersive Travel Experience',
    desc: 'Experience destinations like never before with immersive & interactive technology.',
    tags: [
      '360° Destination Previews',
      'AI Travel Reels',
      'Virtual Try-on',
      'Real-Time Translations',
      'Local History Overlays',
      'Landmark Recognition',
    ],
  },
  {
    slug: 'memory-curation',
    num: '06',
    title: 'Memory Curation',
    desc: 'Every journey ends. Every memory lives on.',
    tags: [
      'AI Travel Journal',
      'Smart Photo & Video',
      'Auto Trip Highlights',
      'Travel Insights',
      'Memory Timeline',
      'Visited Places Archive',
      'Milestone Tracking',
      'Shareable Travel Albums',
      'Digital Travel Diary',
      'Lifetime Journey Archive',
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
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 520px"
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
