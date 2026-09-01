import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { DocBreadcrumb } from '@/components/legal/DocShell'
import { LockIcon, MailIcon, RefundIcon } from '@/components/legal/icons'
import { ContactSupportButton } from './help-actions'
import { HelpSearchAndFaq, type Faq } from './popular-topics'

// Movodream Help Center & Support Page
export const metadata: Metadata = {
  title: 'Help Center | Movodream',
  description:
    'Find answers about bookings, trip changes, refunds and cancellations, or get in touch with the Movodream support team.',
  alternates: { canonical: '/support' },
}

/**
 * Official FAQs provided by management covering products, contact/inquiries,
 * data privacy, and careers with direct redirect links.
 */
const FAQS: Faq[] = [
  {
    q: 'What products does Movodream offer?',
    keywords: 'products izhinga offerings platform features ai travel experience',
    a: (
      <p>
        Movodream develops AI-powered travel products designed to make travel more intelligent, personalized, and
        connected. <strong>iZhinga</strong> is one of its flagship travel experiences.{' '}
        <Link href="/product">Explore our Product Suite &rarr;</Link>
      </p>
    ),
  },
  {
    q: 'How can I get in touch with Movodream?',
    keywords: 'contact touch support partnerships investment media careers connect query form',
    a: (
      <p>
        Whether you&apos;re interested in partnerships, investment, media, careers, or simply want to connect with our
        team, we&apos;d love to hear from you.{' '}
        <a href="#still-need-help">Get in touch via our query form &rarr;</a>
      </p>
    ),
  },
  {
    q: 'How does Movodream handle user privacy and data?',
    keywords: 'privacy data security protect store information handling safety',
    a: (
      <p>
        We take privacy and responsible data handling seriously. Details about how information is collected, used,
        stored, and protected are available in our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    q: 'Is Movodream hiring?',
    keywords: 'hiring jobs careers work opportunities team openings join',
    a: (
      <p>
        We&apos;re always interested in meeting people who want to help shape the future of travel and technology.{' '}
        <Link href="/careers">Explore current opportunities and discover where you could contribute &rarr;</Link>
      </p>
    ),
  },
]

/** Support mascot supplied by the client. */
function HelpArt() {
  return (
    <div className="mascot-glass-card">
      <div className="mascot-glow-backdrop" />
      <div className="mascot-img-wrapper">
        <Image
          src="/assets/support/help-mascot.webp"
          alt="Movodream Support Avatar"
          width={220}
          height={240}
          priority
          className="mascot-img"
        />
      </div>
      <div className="mascot-status-tag">
        <span className="pulse-dot" />
        <span>24/7 AI Assistant Active</span>
      </div>
    </div>
  )
}

export default function SupportPage() {
  return (
    <div className="legal-page">
      <div className="doc-wrap">
        <div className="doc-topbar">
          <DocBreadcrumb trail={[{ label: 'Support' }, { label: 'Help Center' }]} />
        </div>

        <div className="support-hero-banner">
          <div className="support-hero-left">
            <div className="support-pill-badge">
              <span className="badge-star">✨</span>
              <span>Movodream Help Center</span>
            </div>
            <h1 className="support-hero-title">
              How can we <span className="doc-accent">help you today?</span>
            </h1>
            <p className="support-hero-subtitle">
              Find quick answers to common questions about our products, partnerships, data privacy, and career
              opportunities — or reach out directly to our team.
            </p>
          </div>
          <HelpArt />
        </div>

        <div className="support-faq-fullwidth">
          <HelpSearchAndFaq faqs={FAQS} />
        </div>

        <div className="support-contact-banner" id="still-need-help">
          <div className="contact-banner-header">
            <h2>Still need help?</h2>
            <p>Our support team is ready to assist you anytime.</p>
          </div>

          <div className="contact-banner-grid">
            <div className="contact-banner-card primary">
              <ContactSupportButton />
            </div>

            <a className="contact-banner-card-link" href="mailto:support@movodream.com">
              <span className="help-contact-icon">
                <MailIcon />
              </span>
              <span className="contact-card-text">
                Email Us
                <strong>support@movodream.com</strong>
              </span>
            </a>

            <Link className="contact-banner-card-link" href="/cancellation-policy">
              <span className="help-contact-icon">
                <RefundIcon />
              </span>
              <span className="contact-card-text">
                Read the policy
                <strong>Cancellation &amp; Refunds</strong>
              </span>
            </Link>

            <Link className="contact-banner-card-link" href="/privacy-policy">
              <span className="help-contact-icon">
                <LockIcon />
              </span>
              <span className="contact-card-text">
                Read the policy
                <strong>Privacy &amp; Your Data</strong>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
