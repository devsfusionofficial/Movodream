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
  VictoriaMemorial,
  VidhanaSoudha,
} from '@/components/about/Monuments'
import {
  GlobeIcon,
  HeartIcon,
  MapPinIcon,
  ShieldIcon,
  SparkleIcon,
} from '@/components/about/icons'
import { LeadershipSection } from '@/components/about/LeadershipSection'

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

const FOUNDERS = [
  {
    name: 'Harpreet Singh',
    role: 'Founder, CEO',
    image: '/assets/team/harpreet.webp',
    linkedin: 'https://www.linkedin.com/in/harpreet-movodream',
  },
  {
    name: 'Dhiraj Ramjiyani',
    role: 'Co-Founder, CTO',
    image: '/assets/team/dhiraj-ramjiyani.webp',
    linkedin: 'https://www.linkedin.com/in/dhirajramjiyani-movodream/',
  },
]

const MANAGEMENT_TEAM = [
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
  kolkata: { role: 'Office', focus: 'Technology & Regional Operations', art: <VictoriaMemorial /> },
  calcutta: { role: 'Office', focus: 'Technology & Regional Operations', art: <VictoriaMemorial /> },
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
              const role = (office as any).role || meta?.role || 'Office'
              return (
                <article className="about-office" key={office._id}>
                  <div className="about-office-content">
                    <div className="about-office-head">
                      <span className="about-office-pin">
                        <MapPinIcon />
                      </span>
                      <div>
                        <h3>{office.city}</h3>
                        <p className="about-office-role">{role}</p>
                      </div>
                    </div>
                    <p className="about-office-desc">{office.description || meta?.focus}</p>
                  </div>
                  {meta?.art ? (
                    <span className="about-office-art">{meta.art}</span>
                  ) : office.image?.url ? (
                    <span className="about-office-art about-office-photo">
                      <Image
                        src={office.image.url}
                        alt={office.city}
                        width={90}
                        height={90}
                        className="about-office-img"
                      />
                    </span>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Leadership & Management Team */}
      <LeadershipSection founders={FOUNDERS} managementTeam={MANAGEMENT_TEAM} />

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
