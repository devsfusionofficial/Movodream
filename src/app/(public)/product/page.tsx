import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Movodream App | AI Travel Companion',
  description: 'Download the Movodream app — your AI travel companion for smarter trip planning.',
  alternates: { canonical: '/product' },
}

// Static page per the content doc ("static with CTA's to app store download.
// The content shall be shared later."). Structure + working CTAs are in
// place now; swap in real copy/screenshots and live store links when the
// client provides them.
export default function ProductPage() {
  return (
    <>
      <section className="content-hero">
        <h1>The Movodream App</h1>
        <p>
          Your AI travel companion — smarter planning, live guidance, and one connection to everything your trip
          needs.
        </p>

        <div className="content-cta-row">
          <a href="#" className="demo-button">
            Download on the App Store
          </a>
          <a href="#" className="demo-button">
            Get it on Google Play
          </a>
        </div>
      </section>

      <main className="content-body" style={{ textAlign: 'center' }}>
        <p>App store links go live once the client provides the real listings.</p>
      </main>
    </>
  )
}
