import type { Metadata } from 'next'
import Link from 'next/link'
import { DocBreadcrumb } from '@/components/legal/DocShell'
import { LockIcon, MailIcon, RefundIcon, RouteIcon, TicketIcon, UserIcon } from '@/components/legal/icons'
import { ContactSupportButton } from './help-actions'
import { HelpSearchAndFaq, type Faq } from './popular-topics'

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

/** Waving-assistant motif, matched to the reference's mascot slot. */
function HelpArt() {
  return (
    <div className="help-art" aria-hidden="true">
      <svg viewBox="0 0 240 200">
        <defs>
          <linearGradient id="help-brand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e05bc4" />
            <stop offset="55%" stopColor="#c02fa0" />
            <stop offset="100%" stopColor="#7b2fb5" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="104" r="76" fill="#fbf3fa" />
        <rect x="150" y="34" width="66" height="42" rx="14" fill="#f3e6fb" />
        <g fill="#c9a8e6">
          <circle cx="170" cy="55" r="4.5" />
          <circle cx="183" cy="55" r="4.5" />
          <circle cx="196" cy="55" r="4.5" />
        </g>
        <rect x="74" y="62" width="92" height="76" rx="24" fill="url(#help-brand)" />
        <rect x="88" y="82" width="64" height="34" rx="17" fill="#241a3e" />
        <circle cx="108" cy="99" r="7" fill="#fff" />
        <circle cx="132" cy="99" r="7" fill="#fff" />
        <rect x="112" y="44" width="16" height="20" rx="8" fill="#c9a8e6" />
        <circle cx="120" cy="40" r="9" fill="url(#help-brand)" />
        <rect x="52" y="92" width="20" height="46" rx="10" fill="url(#help-brand)" />
        <rect x="168" y="72" width="20" height="46" rx="10" fill="url(#help-brand)" transform="rotate(24 178 95)" />
      </svg>
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

        <div className="help-head">
          <div>
            <h1>
              How can we <span className="doc-accent">help you?</span>
            </h1>
            <p className="help-head-lead">
              Find quick answers to common questions about bookings, changes, refunds and cancellations — or get in
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

        <div className="help-columns" style={{ marginTop: 8 }}>
          <div>
            <HelpSearchAndFaq faqs={FAQS} />
          </div>

          <div className="help-contact" id="still-need-help">
            <h2>Still need help?</h2>
            <p>Our support team is ready to assist you.</p>

            <div className="doc-actions" style={{ marginBottom: 6 }}>
              <ContactSupportButton />
            </div>

            <a className="help-contact-row" href="mailto:support@movodream.com">
              <span className="help-contact-icon">
                <MailIcon />
              </span>
              <span>
                Email Us
                <strong>support@movodream.com</strong>
              </span>
            </a>

            <Link className="help-contact-row" href="/cancellation-policy">
              <span className="help-contact-icon">
                <RefundIcon />
              </span>
              <span>
                Read the policy
                <strong>Cancellation &amp; Refunds</strong>
              </span>
            </Link>

            <Link className="help-contact-row" href="/privacy-policy">
              <span className="help-contact-icon">
                <LockIcon />
              </span>
              <span>
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
