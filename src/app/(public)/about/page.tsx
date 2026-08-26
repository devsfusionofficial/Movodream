import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPublicOffices } from '@/lib/queries/offices'
import {
  BurjKhalifa,
  GatewayOfIndia,
  GoldenTemple,
  IndiaGate,
  SydneyOperaHouse,
  VidhanaSoudha,
} from '@/components/about/Monuments'
import {
  CompassIcon,
  EyeIcon,
  GlobeIcon,
  HeartIcon,
  LinkedInIcon,
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
  {
    icon: <HeartIcon />,
    title: 'Traveler First',
    desc: 'Every innovation, decision, and experience begins with the people we move.',
  },
  {
    icon: <SparkleIcon />,
    title: 'Intelligence That Evolves',
    desc: 'We build technology that learns, adapts, and evolves with every journey.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Trust & Transparency',
    desc: 'We believe and make intelligent systems that are transparent and responsible for every experience to be clear and trustworthy',
  },
  {
    icon: <GlobeIcon />,
    title: 'Built in India. Designed for the World.',
    desc: 'Rooted in India, shaped by global perspectives, and built for journeys everywhere.',
  },
]

const MANAGEMENT_TEAM = [
  {
    name: 'Harpreet Singh',
    role: 'Founder, CEO',
    image: '/assets/team/harpreet-singh.webp',
    linkedin: 'https://www.linkedin.com/in/harpreet-movodream',
  },
  {
    name: 'Dhiraj Ramjiyani',
    role: 'Co-Founder, CTO',
    image: '/assets/team/dhiraj-ramjiyani.webp',
    linkedin: 'https://www.linkedin.com/in/dhirajramjiyani-movodream/',
  },
  {
    name: 'Swanit Sankpal',
    role: 'CPO',
    image: '/assets/team/swanit.webp',
    linkedin: 'https://www.linkedin.com/in/swanit-sankpal-1b9969109/',
  },
  {
    name: 'Harmanpreet Singh',
    role: 'Lead Marketing & Design',
    image: '/assets/team/harman.webp',
    linkedin: 'https://www.linkedin.com/in/-harmanpreet-singh/',
  },
  {
    name: 'Dr. Manjot Singh',
    role: 'Head of Local Guru & Operations',
    image: '/assets/team/manjot-singh.webp',
    linkedin: 'https://www.linkedin.com/company/movodream/',
  },
  {
    name: 'Arjun Bali',
    role: 'VP Product Quality',
    image: '/assets/team/arjun.webp',
    linkedin: 'https://www.linkedin.com/in/arjun-bali-movodream',
  },
]

// Landmark art and the short role line are keyed by city slug. Anything not
// listed still renders — it just gets no artwork — so adding an office in the
// admin never breaks this section.
const OFFICE_META: Record<string, { role: string; focus: string; art: React.ReactNode }> = {
  delhi: { role: 'Head Office', focus: 'Innovation, Engineering & Product', art: <IndiaGate /> },
  mumbai: { role: 'Office', focus: 'Business, Partnerships & Operations', art: <GatewayOfIndia /> },
  amritsar: { role: 'Office', focus: 'Culture, Local Insights & Community', art: <GoldenTemple /> },
  bengaluru: { role: 'Tech Hub', focus: 'AI Research, Technology & Architecture', art: <VidhanaSoudha /> },
  bangalore: { role: 'Tech Hub', focus: 'AI Research, Technology & Architecture', art: <VidhanaSoudha /> },
  dubai: { role: 'International Hub', focus: 'Global Operations & Middle East Expansion', art: <BurjKhalifa /> },
  australia: { role: 'Regional Hub', focus: 'APAC Expansion, Growth & Alliances', art: <SydneyOperaHouse /> },
  sydney: { role: 'Regional Hub', focus: 'APAC Expansion, Growth & Alliances', art: <SydneyOperaHouse /> },
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

  const STATS: { value: string; glyph?: boolean; label: string; sub: React.ReactNode }[] = [
    { value: `${offices.length}+`, label: 'Cities', sub: cityNames || 'Across India' },
    { value: '24/7', label: 'AI Assistance', sub: 'Always here for you' },
    {
      value: '100%',
      label: '100% Rooted',
      sub: (
        <>
          Built with <span className="about-heart">♥</span> in India
        </>
      ),
    },
    // Typographic glyph rather than an icon, so it shares the exact size,
    // weight and baseline of the other three numerals.
    { value: '∞', glyph: true, label: 'Possibilities', sub: 'For every kind of traveler' },
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
            Imagine trips that organize themselves as effortlessly as daydreams. Where we handle the how, so you only feel the wonder. No stress, no spreadsheets—just pure discovery and those perfect moments when a place transforms you forever.
          </p>
          <p className="about-hero-lead" style={{ marginTop: '12px' }}>
            That&apos;s the future we&apos;re building at Movodream—where intelligent technology understands the journey, anticipates what you need, and makes every experience feel effortless, personal, and deeply connected to the world around you.
          </p>
          <span className="about-hero-badge">
            <SparkleIcon />
            <span>
              Built in India <i>·</i> Designed for the World
            </span>
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
              <span className={`about-stat-value${stat.glyph ? ' is-glyph' : ''}`}>{stat.value}</span>
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
            <p>Proudly building our technology and expanding our presence globally.</p>
          </div>
          <div className="about-office-grid">
            {offices.map((office) => {
              const meta = OFFICE_META[office.slug]
              return (
                <article className="about-office" key={office._id}>
                  <div className="about-office-content">
                    <div className="about-office-head">
                      <span className="about-office-pin">
                        <MapPinIcon />
                      </span>
                      <div>
                        <h3>{office.city}</h3>
                        <p className="about-office-role">{meta?.role ?? 'Office'}</p>
                      </div>
                    </div>
                    <p className="about-office-desc">{office.description || meta?.focus}</p>
                  </div>
                  {meta?.art && <span className="about-office-art">{meta.art}</span>}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Leadership & Management Team */}
      <section className="about-leadership">
        <div className="about-center">
          <span className="about-eyebrow">Leadership</span>
          <h2>Meet the Minds Behind Movodream</h2>
          <p>The visionaries, technologists, and builders shaping the future of AI-powered travel.</p>
        </div>
        <div className="about-leadership-grid">
          {MANAGEMENT_TEAM.map((member) => (
            <article className="about-member-card" key={member.name}>
              <div className="about-member-photo-wrap">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={420}
                  className="about-member-photo"
                  sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 20vw"
                />
              </div>
              <div className="about-member-info">
                <div className="about-member-title-group">
                  <h3 className="about-member-name">{member.name}</h3>
                  <p className="about-member-role">{member.role}</p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-member-linkedin"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <LinkedInIcon />
                  <span>Connect</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

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
