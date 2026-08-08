import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPublicOffices } from '@/lib/queries/offices'
import { GatewayOfIndia, GoldenTemple, IndiaGate } from '@/components/about/Monuments'
import {
  CompassIcon,
  EyeIcon,
  GlobeIcon,
  HeartIcon,
  InfinityIcon,
  MapPinIcon,
  NavigateIcon,
  ShieldIcon,
  SparkleIcon,
  TargetIcon,
} from '@/components/about/icons'

export const metadata: Metadata = {
  title: 'About Us | Movodream',
  description:
    'Movodream is a travel technology company on a mission to make every journey smarter, more personal, and truly unforgettable.',
  alternates: { canonical: '/about' },
}

const VALUES = [
  { icon: <HeartIcon />, title: 'Traveler First', desc: 'Every decision starts with the traveler.' },
  { icon: <SparkleIcon />, title: 'Intelligent & Adaptive', desc: 'Our AI learns, adapts, and gets smarter every day.' },
  { icon: <ShieldIcon />, title: 'Trusted & Transparent', desc: 'We protect your data and believe in honest systems.' },
  { icon: <GlobeIcon />, title: 'Local, Yet Global', desc: 'Rooted in India, inspired by the world.' },
]

// Landmark art and the short role line are keyed by city slug. Anything not
// listed still renders — it just gets no artwork — so adding an office in the
// admin never breaks this section.
const OFFICE_META: Record<string, { role: string; focus: string; art: React.ReactNode }> = {
  delhi: { role: 'Head Office', focus: 'Innovation, Engineering & Product', art: <IndiaGate /> },
  mumbai: { role: 'Office', focus: 'Business, Partnerships & Operations', art: <GatewayOfIndia /> },
  amritsar: { role: 'Office', focus: 'Culture, Local Insights & Community', art: <GoldenTemple /> },
}

export default async function AboutPage() {
  const offices = await getPublicOffices()
  const cityNames = offices.map((office) => office.city).join(', ')

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

  const STATS: { value?: string; icon?: React.ReactNode; label: string; sub: React.ReactNode }[] = [
    { value: `${offices.length}+`, label: 'Cities', sub: cityNames || 'Across India' },
    { value: '24/7', label: 'AI Assistance', sub: 'Always here for you' },
    {
      value: '100%',
      label: 'India Born',
      sub: (
        <>
          Built with <span className="about-heart">♥</span> in India
        </>
      ),
    },
    { icon: <InfinityIcon />, label: 'Possibilities', sub: 'For every kind of traveler' },
  ]

  return (
    <div className="about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="about-crumb">
        <Link href="/">Home</Link> › <span>About Us</span>
      </section>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-copy">
          <h1>
            About <span className="p">Movodream</span>
          </h1>
          <p className="about-hero-tag">Building the future of travel with AI, empathy and local intelligence.</p>
          <p className="about-hero-lead">
            Movodream is a travel technology company on a mission to make every journey smarter, more personal, and
            truly unforgettable.
          </p>
          <span className="about-hero-badge">
            <SparkleIcon />
            Built in India <i>·</i> Designed for the World
          </span>
        </div>

        <div className="about-hero-visual">
          <Image
            src="/assets/about/hero.webp"
            alt="The Movodream mascot looking out over a valley at sunset"
            fill
            sizes="(max-width: 980px) 100vw, 46vw"
            priority
          />
          <span className="about-chip about-chip--1">
            <span className="about-chip-icon">
              <CompassIcon />
            </span>
            <span className="about-chip-text">
              <strong>AI Trip Planner</strong>
              <span>Plans in seconds</span>
            </span>
          </span>
          <span className="about-chip about-chip--2">
            <span className="about-chip-icon">
              <NavigateIcon />
            </span>
            <span className="about-chip-text">
              <strong>Live Guidance</strong>
              <span>During your trip</span>
            </span>
          </span>
          <span className="about-chip about-chip--3">
            <span className="about-chip-icon">
              <MapPinIcon />
            </span>
            <span className="about-chip-text">
              <strong>Local Intelligence</strong>
              <span>From trusted experts</span>
            </span>
          </span>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="about-pillars">
        <div className="about-pillars-grid">
          <article className="about-pillar">
            <span className="about-pillar-icon">
              <TargetIcon />
            </span>
            <div>
              <span className="about-eyebrow">Our Mission</span>
              <h3>
                Simplify Travel.
                <br />
                Enrich Experiences.
              </h3>
              <p>
                We combine AI, contextual intelligence, and human expertise to help travelers plan better, decide
                faster, and explore deeper.
              </p>
            </div>
          </article>

          <article className="about-pillar">
            <span className="about-pillar-icon">
              <EyeIcon />
            </span>
            <div>
              <span className="about-eyebrow">Our Vision</span>
              <h3>
                A World Where
                <br />
                Travel Plans Itself.
              </h3>
              <p>
                Imagine trips that organize themselves as effortlessly as daydreams, powered by real-time insights and
                local understanding.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* What drives us */}
      <section className="about-values">
        <div className="about-center">
          <h2>What Drives Us</h2>
          <p>The principles that shape everything we build.</p>
        </div>
        <div className="about-values-row">
          {VALUES.map((value) => (
            <div className="about-value" key={value.title}>
              <span className="about-value-icon">{value.icon}</span>
              <div>
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="about-stats-panel">
          {STATS.map((stat) => (
            <div className="about-stat" key={stat.label}>
              <span className="about-stat-value">{stat.icon ?? stat.value}</span>
              <strong>{stat.label}</strong>
              <p>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offices */}
      {offices.length > 0 && (
        <section className="about-presence">
          <div className="about-center">
            <h2>Our Presence</h2>
            <p>Proudly building our technology and teams in India.</p>
          </div>
          <div className="about-office-grid">
            {offices.map((office) => {
              const meta = OFFICE_META[office.slug]
              return (
                <article className="about-office" key={office._id}>
                  <div className="about-office-head">
                    <MapPinIcon />
                    <div>
                      <h3>{office.city}</h3>
                      <p className="about-office-role">{meta?.role ?? 'Office'}</p>
                    </div>
                  </div>
                  <p className="about-office-desc">{office.description || meta?.focus}</p>
                  {meta?.art && <span className="about-office-art">{meta.art}</span>}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Team */}
      <section className="about-team">
        <div className="about-team-panel">
          <Image
            src="/assets/about/team.webp"
            alt="Four Movodream team members in branded hoodies"
            width={1200}
            height={622}
            className="about-team-art"
            sizes="(max-width: 980px) 90vw, 420px"
          />
          <div className="about-team-copy">
            <h2>
              A Team of <span className="p">Dreamers, Builders &amp; Explorers.</span>
            </h2>
            <p>
              We&apos;re travelers, technologists, designers and storytellers working together to create the most
              intelligent travel companion in the world.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
