import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicOfficeBySlug } from '@/lib/queries/offices'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const office = await getPublicOfficeBySlug(slug)
  if (!office) return {}

  return {
    title: `Movodream ${office.city} | AI Travel Technology`,
    description:
      office.description ??
      `Movodream's ${office.city} office — part of our nationwide presence driving AI-powered travel technology.`,
    alternates: { canonical: `/offices/${office.slug}` },
  }
}

export default async function OfficeDetailPage({ params }: PageProps) {
  const { slug } = await params
  const office = await getPublicOfficeBySlug(slug)
  if (!office || office.status !== 'live') notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Movodream ${office.city}`,
    address: office.address,
    url: `https://movodream.com/offices/${office.slug}`,
    ...(office.gmbLink ? { hasMap: office.gmbLink } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="content-hero">
        <h1>Movodream {office.city}</h1>
        {office.address && <p>{office.address}</p>}
      </section>

      <main className="content-body" style={{ textAlign: 'center' }}>
        <Link href="/offices" className="content-back-link">
          ← All offices
        </Link>

        {office.description && <p>{office.description}</p>}

        {office.gmbLink && (
          <div className="content-cta-row">
            <a href={office.gmbLink} target="_blank" rel="noopener noreferrer" className="demo-button">
              View on Google Business Profile
            </a>
          </div>
        )}
      </main>
    </>
  )
}
