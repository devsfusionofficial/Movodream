import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublicOffices } from '@/lib/queries/offices'

export const metadata: Metadata = {
  title: 'Our Offices | Movodream',
  description: 'Movodream office locations across India — Delhi, Mumbai, Amritsar, and beyond.',
  alternates: { canonical: '/offices' },
}

export default async function OfficesIndexPage() {
  const offices = await getPublicOffices()

  return (
    <>
      <section className="content-hero">
        <h1>Our Offices</h1>
        <p>Built in India, driving global travel innovation.</p>
      </section>

      <main className="content-body" style={{ maxWidth: 1040 }}>
        <div className="offices-grid">
          {offices.map((office) => {
            const isLive = office.status === 'live'
            const inner = (
              <>
                <div className="office-card-top">
                  <h2>{office.city}</h2>
                  <span className="office-badge">{isLive ? 'Live' : 'Coming Soon'}</span>
                </div>
                {office.address && <p>{office.address}</p>}
              </>
            )

            return isLive ? (
              <Link
                key={office._id}
                href={`/offices/${office.slug}`}
                className="office-card is-live"
              >
                {inner}
              </Link>
            ) : (
              <div key={office._id} className="office-card">
                {inner}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
