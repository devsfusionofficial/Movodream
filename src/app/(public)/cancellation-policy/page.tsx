import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Movodream',
  description: 'Movodream’s cancellation and refund policy for bookings made through our platform.',
  alternates: { canonical: '/cancellation-policy' },
}

const SECTIONS = [
  'Overview',
  'Cancellation Windows',
  'Refund Eligibility & Timelines',
  'Non-Refundable Items',
  'How to Request a Cancellation',
  'Changes to This Policy',
  'Contact Us',
]

// IMPORTANT: structural template only. The actual cancellation windows,
// refund percentages, and eligibility rules are legal/business terms that
// must come from the client — nothing here should be invented and
// published as-is. Fill each section in from real policy content before
// this page goes live, the same way /product is waiting on real app-store copy.
export default function CancellationPolicyPage() {
  return (
    <>
      <section className="content-hero">
        <h1>Cancellation &amp; Refund Policy</h1>
      </section>

      <main className="content-body">
        <div className="content-notice">
          Placeholder page — section structure only. Real policy terms (cancellation windows, refund percentages,
          eligibility rules) are pending from the client before this can go live.
        </div>

        {SECTIONS.map((title) => (
          <section key={title}>
            <h2>{title}</h2>
            <p style={{ fontStyle: 'italic' }}>Content pending from client.</p>
          </section>
        ))}
      </main>
    </>
  )
}
