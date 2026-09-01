import type { Metadata } from 'next'
import Image from 'next/image'
import { getPublicPartners } from '@/lib/queries/partners'
import { IzhingaFeatures } from './izhinga-features'
import { ProductHeroCta, ProductFinalCta } from './product-cta-row'

export const metadata: Metadata = {
  title: 'iZhinga | AI Travel Companion by Movodream',
  description:
    'iZhinga, powered by Movodream — the AI travel companion that plans, books, and guides your whole trip in one place.',
  alternates: { canonical: '/product' },
  openGraph: {
    title: 'iZhinga | AI Travel Companion by Movodream',
    description: 'The AI travel companion that plans, books, and guides your whole trip in one place.',
    url: '/product',
    siteName: 'Movodream',
    images: [
      {
        url: '/assets/product/hero-window.webp',
        width: 1400,
        height: 800,
        alt: 'iZhinga AI Travel Companion',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iZhinga | AI Travel Companion by Movodream',
    description: 'The AI travel companion that plans, books, and guides your whole trip in one place.',
    images: ['/assets/product/hero-window.webp'],
  },
}

const STEPS = [
  {
    num: '01',
    icon: 'fa-user',
    title: 'Understand You',
    desc: 'Learns your preferences, interests, travel style, and journey context.',
  },
  {
    num: '02',
    icon: 'fa-brain',
    title: 'Learn & Anticipate',
    desc: 'Learns from your preferences and journey over time, becoming more intuitive and relevant with every experience.',
  },
  {
    num: '03',
    icon: 'fa-lightbulb',
    title: 'Aware & Intelligent',
    desc: 'Brings destination intelligence, experiences, timing, and real-time context together.',
  },
  {
    num: '04',
    icon: 'fa-compass',
    title: 'Guide & Adapt',
    desc: 'Keeps up with your journey in real time, adapting recommendations and guidance as things change.',
  },
]

const ECOSYSTEM_LEFT = [
  { icon: 'fa-ticket', title: 'Booking Engine', desc: 'Flights, Hotels, Trains, Cabs & more' },
  { icon: 'fa-satellite-dish', title: 'Live Travel Mode', desc: 'Real-time updates, alerts & assistance' },
]

const ECOSYSTEM_RIGHT = [
  { icon: 'fa-user-check', title: 'Local Guru', desc: 'Verified experts, hidden gems & experiences' },
  { icon: 'fa-images', title: 'Memory Curation', desc: 'Your journeys, memories & milestones' },
]

const TRUST = [
  { icon: 'fa-star', title: 'Built for India', desc: 'Designed for Indian travelers' },
  { icon: 'fa-shield-halved', title: 'Secure & Trusted', desc: 'Your data is protected with bank-grade security' },
  { icon: 'fa-headset', title: '24/7 Assistance', desc: 'Real people. Real help. Whenever you need it.' },
  { icon: 'fa-lock', title: 'Privacy First', desc: "You're in control of your data and preferences" },
]

// The client's content doc requires a "Technology Showcase" listing these
// eight capabilities. The design mock has no slot for them, so they're kept
// here as a compact tile grid rather than dropped.
const TECHNOLOGIES = [
  'AI Travel Operating System',
  'AI Itinerary Intelligence',
  'Intelligent Recommendations',
  'Live Travel Intelligence',
  'Local Intelligence',
  'AI Memory Curation',
  'Integrated Travel Commerce',
  'AI-Powered Personalization',
]

// Verbatim from the client's content doc ("The Future of Travel").
const STATS = [
  { label: '80%+', desc: 'Travelers use digital platforms during trip planning' },
  { label: 'Growing Demand', desc: 'Experience-led travel continues to rise among modern travelers' },
  { label: '24/7 Expectations', desc: 'Travelers increasingly expect instant, intelligent assistance' },
  { label: 'Emerging Tech', desc: 'AR, VR, and AI are redefining how destinations are discovered and experienced' },
]

// Copy ported from the client's "Product summary" reference doc. The doc
// names the app "Izhinga" throughout ("Powered By Movodream") — client
// confirmed this is the real product name, not a placeholder.
export default async function ProductPage() {
  const partners = await getPublicPartners()

  return (
    <div className="product-page">
      <section id="overview" className="product-hero">
        <div className="product-hero-text">
          <span className="product-eyebrow">Product</span>
          <h1>
            The Future of Travel is <span className="product-accent">Intelligent</span>
          </h1>
          <p className="product-hero-lead">
            iZhinga is an intelligent travel companion built to transform the way you experience a journey — from
            discovering the right places to exploring with AI-powered guidance, trusted local insights, seamless
            bookings, and memories worth keeping.
          </p>
          <ProductHeroCta />

          <div className="product-trustedby">
            <p>TRUSTED BY TRAVELERS & LEADING PARTNERS</p>
            <div className="product-trustedby-text-strip">
              <span className="trustedby-brand">Aviationstack</span>
              <span className="trustedby-brand">CleverTap</span>
              <span className="trustedby-brand">EMBARK</span>
              <span className="trustedby-brand">EQUENCE</span>
              <span className="trustedby-brand">Gozo Cabs</span>
            </div>
          </div>
        </div>

        <div className="product-hero-visual">
          <Image
            src="/assets/product/hero-window.webp"
            alt="iZhinga AI Travel Companion"
            fill
            sizes="(max-width: 900px) 100vw, (max-width: 1400px) 50vw, 700px"
            quality={85}
            priority
          />
        </div>
      </section>

      <section className="product-steps-section">
        <h2 className="product-section-title">
          How <span className="product-accent">iZhinga AI</span> works for you
        </h2>
        <div className="product-steps">
          {STEPS.map((step, i) => (
            <div key={step.num} className={`product-step${i < STEPS.length - 1 ? ' has-connector' : ''}`}>
              <span className="product-step-icon">
                <i className={`fa-solid ${step.icon}`} />
              </span>
              <div className="product-step-content">
                <h3>
                  <span className="product-step-num">{step.num}</span>
                  <span className="product-step-dash">-</span>
                  <span className="product-step-title">{step.title}</span>
                </h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="izhinga-features-section">
        <IzhingaFeatures />
      </section>

      {/*
      <section className="product-ecosystem-section">
        <h2 className="product-section-title">
          All-in-one <span className="product-accent">intelligent</span> travel ecosystem
        </h2>
        <div className="product-ecosystem">
          <div className="product-ecosystem-col">
            {ECOSYSTEM_LEFT.map((node) => (
              <div key={node.title} className="product-node">
                <span className="product-node-icon">
                  <i className={`fa-solid ${node.icon}`} />
                </span>
                <div>
                  <h4>{node.title}</h4>
                  <p>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="product-ecosystem-core">
            <div className="product-core-ring">
              <span className="product-core-inner">iZhinga AI Core</span>
            </div>
            <div className="product-node product-node--center">
              <span className="product-node-icon">
                <i className="fa-solid fa-credit-card" />
              </span>
              <div>
                <h4>Smart Payments</h4>
                <p>Secure, seamless transactions</p>
              </div>
            </div>
          </div>

          <div className="product-ecosystem-col">
            {ECOSYSTEM_RIGHT.map((node) => (
              <div key={node.title} className="product-node">
                <span className="product-node-icon">
                  <i className={`fa-solid ${node.icon}`} />
                </span>
                <div>
                  <h4>{node.title}</h4>
                  <p>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-trust">
          {TRUST.map((item) => (
            <div key={item.title} className="product-trust-item">
              <span className="product-trust-icon">
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
      */}

      <section id="technology" className="product-tech-section">
        <h2 className="product-section-title">
          Reimagining Travel Through <span className="product-accent">Technology</span>
        </h2>
        <p className="product-tech-lead">
          At Movodream, we develop technologies that address real traveler needs before, during, and after a journey.
          By leveraging artificial intelligence, automation, data intelligence, and contextual guidance, we create
          travel experiences that are more adaptive, informed, and personalized.
        </p>
        <div className="product-tech-grid">
          {TECHNOLOGIES.map((tech) => (
            <div key={tech} className="product-tech-tile">
              {tech}
            </div>
          ))}
        </div>
      </section>

      <section className="product-vision-section">
        <div className="product-vision-text">
          <span className="product-vision-eyebrow">The Future of Travel</span>
          <h2>
            Smarter. More Human.
            <br />
            <span className="product-accent">More Connected.</span>
          </h2>
          <p>
            At Movodream, we are building the next generation of travel technology to make every journey effortless,
            personal, and unforgettable.
          </p>
          <div className="product-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="product-stat">
                <span className="product-stat-label">{stat.label}</span>
                <p>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="product-vision-visual">
          <Image
            src="/assets/product/future-travel-hero.webp"
            alt="The Future of Travel"
            fill
            sizes="(max-width: 900px) 100vw, (max-width: 1400px) 50vw, 600px"
            quality={90}
          />
        </div>
      </section>

      <section className="product-final-cta">
        <div className="product-final-inner">
          <div>
            <h2>
              Ready to experience
              <br />
              travel that thinks with you?
            </h2>
            <p>Plan smarter. Travel better. Only with iZhinga AI.</p>
          </div>
          <ProductFinalCta />
        </div>
      </section>
    </div>
  )
}
