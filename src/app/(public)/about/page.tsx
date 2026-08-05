import type { Metadata } from 'next'
import Image from 'next/image'
import { getPublicOffices } from '@/lib/queries/offices'
import { IndiaMap } from '@/components/about/IndiaMap'
import {
  BrainIcon,
  BuildingIcon,
  BulbIdeaIcon,
  CompassIcon,
  ConfusionIcon,
  DiscoverIcon,
  ExpandIcon,
  GalleryIcon,
  GlobeIcon,
  MapPinIcon,
  NavigateIcon,
  PuzzleIcon,
  RocketIcon,
  SuitcaseIcon,
  TabsIcon,
  TargetIcon,
} from '@/components/about/icons'
import { AboutHeroCta, AboutFinalCta } from './about-cta-row'

export const metadata: Metadata = {
  title: 'About Us | Movodream',
  description:
    'Movodream is a travel technology and innovation company building intelligent digital experiences for the next generation of travelers.',
  alternates: { canonical: '/about' },
}

// Every pain point below is the client's own framing of the problem
// Movodream was built to solve — not invented copy.
const PROBLEMS = [
  {
    icon: <TabsIcon />,
    title: 'Planning is fragmented',
    desc: 'A trip today is stitched together across a dozen tabs, apps and group chats before a single booking is made.',
  },
  {
    icon: <ConfusionIcon />,
    title: 'Generic advice, not your trip',
    desc: 'Most recommendations are the same for every traveler — nothing adapts to your preferences, pace or budget.',
  },
  {
    icon: <TargetIcon />,
    title: 'Support stops at booking',
    desc: 'The help disappears the moment you actually start traveling — exactly when plans change and you need it most.',
  },
  {
    icon: <PuzzleIcon />,
    title: 'Memories get lost',
    desc: 'Photos, itineraries and highlights are scattered across devices instead of living as one story of the trip.',
  },
]

// The five capabilities Movodream's AI ecosystem is built around, as
// described in the client's product summary — used for both the orb diagram
// and, paired with the real product imagery, the ecosystem showcase below.
const CAPABILITIES = [
  { icon: <BrainIcon />, label: 'Plan' },
  { icon: <SuitcaseIcon />, label: 'Book' },
  { icon: <NavigateIcon />, label: 'Navigate' },
  { icon: <DiscoverIcon />, label: 'Discover' },
  { icon: <GalleryIcon />, label: 'Remember' },
]

const ECOSYSTEM = [
  {
    slug: 'ai-travel-brain',
    title: 'AI Travel Brain',
    desc: 'The context-aware AI that understands you better than any travel expert.',
  },
  {
    slug: 'live-travel-mode',
    title: 'Live Travel Mode',
    desc: 'Real-time guidance that stays with you for the whole trip, not just the booking.',
  },
  {
    slug: 'booking-engine',
    title: 'Integrated Booking Engine',
    desc: 'From AI recommendation to confirmed booking — in just one click.',
  },
  {
    slug: 'local-guru',
    title: 'Local Guru',
    desc: 'Discover authentic experiences, hidden gems and trusted local experts.',
  },
  {
    slug: 'memory-curation',
    title: 'Memory Curation',
    desc: 'Every journey ends. Every memory lives on.',
  },
]

// Phases, not dates — no founding year has been confirmed by the client, so
// none is invented here. The sequence itself (idea → build → India-first
// launch → what's next) is true regardless of when each step happened.
const TIMELINE = [
  {
    icon: <BulbIdeaIcon />,
    title: 'The Idea',
    desc: "Movodream started with a simple question: why is travel planning still this hard?",
  },
  {
    icon: <BrainIcon />,
    title: 'Building iZhinga AI',
    desc: 'We began building an AI-first travel ecosystem instead of another booking app.',
  },
  {
    icon: <MapPinIcon />,
    title: 'India First',
    desc: 'Launched from Delhi, Mumbai and Amritsar to build for India’s travelers first.',
  },
  {
    icon: <RocketIcon />,
    title: "What's Next",
    desc: 'Growing iZhinga AI into a platform travelers everywhere can rely on.',
  },
]

export default async function AboutPage() {
  const offices = await getPublicOffices()
  const liveOfficeCount = offices.filter((office) => office.status === 'live').length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Movodream',
    url: 'https://movodream.com/about',
    about: {
      '@type': 'Organization',
      name: 'Movodream',
      location: offices.map((office) => ({
        '@type': 'Place',
        name: `Movodream ${office.city}`,
        address: office.address,
      })),
    },
  }

  return (
    <div className="about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. Hero */}
      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="about-eyebrow">
            <i className="fa-solid fa-star" /> About Movodream
          </span>
          <h1>
            Building the <span className="about-accent">AI Operating System</span> for travel
          </h1>
          <p className="about-hero-lead">
            Movodream is a travel technology and innovation company building intelligent digital experiences for the
            next generation of travelers — powered by our AI travel companion, iZhinga AI.
          </p>
          <AboutHeroCta />
        </div>
        <div className="about-hero-visual">
          <div className="about-hero-glow" />
          <div className="about-hero-orb" />
          <span className="about-hero-chip about-hero-chip--1">
            <BrainIcon /> AI-Powered Planning
          </span>
          <span className="about-hero-chip about-hero-chip--2">
            <GlobeIcon /> India First
          </span>
          <span className="about-hero-chip about-hero-chip--3">
            <CompassIcon /> Real-Time Guidance
          </span>
        </div>
      </section>

      {/* 2. Why We Exist */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <span className="about-eyebrow">Why We Exist</span>
          <blockquote>
            Travel has evolved, but the way people plan, navigate, and experience destinations remains fragmented.
            Movodream exists to bridge these gaps through technology, enabling travelers to explore with greater
            confidence, convenience, and deeper cultural connection.
          </blockquote>
        </div>
      </section>

      {/* 3. The Problem */}
      <section className="about-problem">
        <div className="about-section-head">
          <span className="about-eyebrow">The Problem</span>
          <h2 className="about-section-title">Travel planning hasn&apos;t kept up with travelers</h2>
        </div>
        <div className="about-problem-grid">
          <div className="about-problem-list">
            {PROBLEMS.map((problem) => (
              <div className="about-problem-item" key={problem.title}>
                <span className="about-problem-icon">{problem.icon}</span>
                <div>
                  <h4>{problem.title}</h4>
                  <p>{problem.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="about-problem-card">
            <span className="about-problem-card-label">Our Vision</span>
            <p>
              A world where travel plans itself. Imagine trips that organize themselves as effortlessly as
              daydreams — where we handle the how, so you only feel the wonder.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Our Solution — AI Ecosystem */}
      <section className="about-solution">
        <div className="about-section-head">
          <span className="about-eyebrow">Our Solution</span>
          <h2 className="about-section-title">
            One AI ecosystem, <span className="about-accent">every step of the journey</span>
          </h2>
          <p className="about-section-lead">
            iZhinga AI, powered by Movodream, connects planning, booking, navigation, discovery and memory into a
            single intelligent companion.
          </p>
        </div>
        <div className="about-orb-wrap">
          <div className="about-orb-ring" />
          <div className="about-orb-core">iZhinga AI</div>
          {CAPABILITIES.map((cap, i) => (
            <span className={`about-orb-node about-orb-node--${i}`} key={cap.label}>
              {cap.icon} {cap.label}
            </span>
          ))}
        </div>
      </section>

      {/* 5. Product Ecosystem Showcase */}
      <section className="about-ecosystem">
        <div className="about-section-head">
          <span className="about-eyebrow">Product Ecosystem</span>
          <h2 className="about-section-title">
            Five capabilities. <span className="about-accent">One companion.</span>
          </h2>
        </div>
        <div className="about-ecosystem-grid">
          {ECOSYSTEM.map((item) => (
            <div className="about-ecosystem-card" key={item.slug}>
              <div className="about-ecosystem-media">
                <Image
                  src={`/assets/product/${item.slug}.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 360px"
                />
              </div>
              <div className="about-ecosystem-body">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. India First, Global Vision */}
      <section className="about-india">
        <div className="about-india-grid">
          <div>
            <span className="about-eyebrow">India First, Global Vision</span>
            <h2 className="about-section-title">
              Built in India. <span className="about-accent">Driving global travel innovation.</span>
            </h2>
            <p className="about-section-lead" style={{ margin: '14px 0 28px' }}>
              With offices in Delhi, Mumbai, and Amritsar, Movodream combines nationwide expertise with a global
              vision — fueling intelligent travel technology designed for the future of travel.
            </p>
            {offices.length > 0 && (
              <div className="about-office-list">
                {offices.map((office) => (
                  <div className="about-office-row" key={office._id}>
                    <span className="about-office-row-icon">
                      <BuildingIcon />
                    </span>
                    <div>
                      <h4>{office.city}</h4>
                      {office.address && <p>{office.address}</p>}
                    </div>
                    {office.status === 'live' && <span className="about-office-row-badge">Live</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <IndiaMap className="about-india-map" />
        </div>
      </section>

      {/* 7. Company Stats — real, not invented */}
      <section className="about-stats">
        <div className="about-stats-row">
          <div className="about-stat">
            <span className="about-stat-value">{liveOfficeCount || offices.length}</span>
            <p>Offices across India</p>
          </div>
          <div className="about-stat">
            <span className="about-stat-value">5</span>
            <p>Core AI capabilities in one ecosystem</p>
          </div>
          <div className="about-stat">
            <span className="about-stat-value">1</span>
            <p>AI travel companion — iZhinga AI</p>
          </div>
          <div className="about-stat">
            <span className="about-stat-value">24/7</span>
            <p>AI-powered assistance, end to end</p>
          </div>
        </div>
      </section>

      {/* 8. Timeline */}
      <section className="about-timeline-section">
        <div className="about-section-head">
          <span className="about-eyebrow">Our Journey</span>
          <h2 className="about-section-title">From an idea to an AI travel ecosystem</h2>
        </div>
        <div className="about-timeline">
          {TIMELINE.map((step, i) => (
            <div className="about-timeline-step" key={step.title}>
              <span className="about-timeline-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Future Vision */}
      <section className="about-vision">
        <div className="about-vision-inner">
          <span className="about-eyebrow">
            <ExpandIcon /> Future Vision
          </span>
          <h2>
            A World Where <span className="about-accent">Travel Plans Itself</span>
          </h2>
          <p>
            Imagine trips that organize themselves as effortlessly as daydreams. Where we handle the how, so you
            only feel the wonder. No stress, no spreadsheets — just pure discovery and those perfect moments when a
            place transforms you forever.
          </p>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="about-cta">
        <div>
          <h2>Ready to travel with an AI that thinks with you?</h2>
          <p>Plan smarter. Travel better. Only with iZhinga AI.</p>
        </div>
        <AboutFinalCta />
      </section>
    </div>
  )
}
