import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { DocBreadcrumb } from '@/components/legal/DocShell'
import { LockIcon, MailIcon, RefundIcon, RouteIcon, TicketIcon, UserIcon } from '@/components/legal/icons'
import { ContactSupportButton } from './help-actions'
import { HelpSearchAndFaq, type Faq } from './popular-topics'

// Movodream Help Center & Support Page
export const metadata: Metadata = {
  title: 'Help Center | Movodream',
  description:
    'Find answers about bookings, trip changes, refunds and cancellations, or get in touch with the Movodream support team.',
  alternates: { canonical: '/support' },
}

// Cards earn their place here — these are genuine entry points into distinct
// topics, unlike on the policy pages where they were hiding legal text.
// Each links to the section that actually documents it; no category landing
// pages have been invented.
const TOPICS = [
  {
    icon: <TicketIcon />,
    title: 'Booking Support',
    copy: 'Get help with bookings, payments & confirmations.',
    href: '/cancellation-policy#third-party',
  },
  {
    icon: <RouteIcon />,
    title: 'Manage Trips',
    copy: 'Modify, reschedule or cancel your trips.',
    href: '/cancellation-policy#modifications',
  },
  {
    icon: <RefundIcon />,
    title: 'Refunds & Cancellations',
    copy: 'Learn about refunds and cancellations.',
    href: '/cancellation-policy#refund-processing',
  },
  {
    icon: <UserIcon />,
    title: 'Privacy & Data',
    copy: 'Manage your data, rights & security.',
    href: '/privacy-policy#your-rights',
  },
]

/**
 * Every answer is a summary of, and links through to, the published
 * Cancellation & Refund Policy or Privacy Policy — no support commitments
 * (timelines, fees, guarantees) appear here that aren't already in
 * client-approved text.
 */
const FAQS: Faq[] = [
  {
    q: 'How do I cancel my booking?',
    keywords: 'cancel cancellation stop booking trip end',
    a: (
      <p>
        Contact us with your booking reference and we will process the request. What you are eligible for depends on
        the stage the service has reached — see{' '}
        <Link href="/cancellation-policy#customer-cancellation">Customer-Initiated Cancellation</Link>. Bookings made
        with airlines, hotels or other partners follow{' '}
        <Link href="/cancellation-policy#third-party">that provider&apos;s own terms</Link>.
      </p>
    ),
  },
  {
    q: 'When will I receive my refund?',
    keywords: 'refund money back payment returned timeline when',
    a: (
      <p>
        Approved refunds are returned through the original payment method wherever feasible. Timelines depend on your
        bank, payment gateway and the relevant service provider, so we can&apos;t guarantee a fixed date — the full
        detail is under <Link href="/cancellation-policy#refund-processing">Refund Processing</Link>.
      </p>
    ),
  },
  {
    q: 'How can I change or reschedule my trip?',
    keywords: 'change reschedule modify amend date edit trip itinerary',
    a: (
      <p>
        Send us your change request and we will make reasonable efforts to accommodate it. Changes may be subject to
        availability, and some bookings are non-changeable or carry amendment fees set by the provider. See{' '}
        <Link href="/cancellation-policy#modifications">Changes and Modification Requests</Link>.
      </p>
    ),
  },
  {
    q: 'What happens if I miss a booking or consultation?',
    keywords: 'no-show missed miss late absent consultation',
    a: (
      <p>
        If a confirmed booking or scheduled consultation is missed without prior notice, refunds may not be
        available, and any no-show charges applied by the supplier are payable by you. See{' '}
        <Link href="/cancellation-policy#no-show">No-Show Policy</Link>.
      </p>
    ),
  },
  {
    q: 'I was charged twice — what should I do?',
    keywords: 'duplicate charged twice double payment overcharge billing error',
    a: (
      <p>
        Contact support promptly with the transaction details. Verified duplicate or erroneous payments are reviewed
        and refunded to the original payment method wherever applicable — see{' '}
        <Link href="/cancellation-policy#duplicate-payments">Duplicate Payments and Technical Errors</Link>.
      </p>
    ),
  },
  {
    q: 'How do I raise a complaint or access my data?',
    keywords: 'complaint grievance dispute data privacy access delete rights',
    a: (
      <p>
        Complaints and disputes go through <Link href="/cancellation-policy#grievance">Grievance Redressal</Link> —
        please include booking references and any supporting records. For access, correction or deletion of your
        personal data, see <Link href="/privacy-policy#your-rights">Your Rights</Link>.
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
              Find quick answers to common questions about bookings, trip changes, refunds and cancellations — or get in
              touch with our support team.
            </p>
          </div>
          <HelpArt />
        </div>

        <h2 className="help-block-title" style={{ marginTop: 28 }}>
          Popular Topics
        </h2>
        <div className="help-topics">
          {TOPICS.map((topic) => (
            <Link className="help-topic-card" href={topic.href} key={topic.title}>
              <span className="help-topic-icon">{topic.icon}</span>
              <h3>{topic.title}</h3>
              <p>{topic.copy}</p>
            </Link>
          ))}
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
