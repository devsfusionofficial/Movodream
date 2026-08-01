import Image from 'next/image'
import { getPublicPartners } from '@/lib/queries/partners'

// Content verbatim from the client's content doc. Logo grid uses flex-wrap
// so it scales naturally from 1 partner to 10+ without layout changes —
// per the requirement that this section scale as partnerships are added.
export async function PartnersSection() {
  const partners = await getPublicPartners()
  if (partners.length === 0) return null

  return (
    <section className="partners-section">
      <div className="partners-inner">
        <h2>Innovation in travel thrives through collaboration</h2>
        <p>
          Building the future of travel requires collaboration across technology, tourism, hospitality, and
          innovation. We are proud to work with organizations that share our vision of creating smarter, more
          connected travel experiences.
        </p>

        <p className="partners-label">Trusted By &amp; Working With</p>
        <div className="partners-logos">
          {partners.map((partner) => {
            const content = partner.logo?.url ? (
              <div className="partners-logo-box">
                <Image src={partner.logo.url} alt={partner.name} fill sizes="140px" />
              </div>
            ) : (
              <span className="partner-name-fallback">{partner.name}</span>
            )

            return partner.url ? (
              <a key={partner._id} href={partner.url} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={partner._id}>{content}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
