import Image from 'next/image'
import { getPublicPartners } from '@/lib/queries/partners'
import { PartnerWithUsButton } from './PartnerWithUsButton'

// Headline/lead copy is verbatim from the client's content doc. The logo grid
// is a responsive `auto-fit` grid so it scales naturally from 1 partner to
// 10+ without layout changes — per the requirement that this section grow as
// partnerships are added.

// Static supporting copy from the approved partner-section reference — these
// are brand statements, not partner data, so they aren't CMS-managed.
const PARTNER_VALUES = [
  {
    title: 'Trusted Partnerships',
    copy: 'Collaborating with industry leaders worldwide',
    icon: (
      <path
        d="M12 2.6l6.6 2.5v5.5c0 4.2-2.8 8-6.6 9.4-3.8-1.4-6.6-5.2-6.6-9.4V5.1L12 2.6z M9.2 11.9l2 2 3.6-3.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Shared Innovation',
    copy: 'Building smarter solutions for modern travelers',
    icon: (
      <path
        d="M13.9 4.2c2.6-1.2 5.1-1.3 5.9-.5.8.8.7 3.3-.5 5.9-1.3 2.8-4 5.8-7.4 8L8.2 14 6 10.2c2.2-3.4 5.2-6 8-7.3z M9.6 16.4c-.6 1.9-2 3-4.3 3.5.5-2.3 1.6-3.7 3.5-4.3 M13.4 10.6a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Stronger Together',
    copy: 'Uniting technology, tourism & hospitality',
    icon: (
      <path
        d="M9.4 11.2a3 3 0 100-6 3 3 0 000 6z M16.6 11.6a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8z M3.4 18.6c0-2.8 2.7-4.6 6-4.6s6 1.8 6 4.6 M17 14.2c2.2.4 3.6 1.9 3.6 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Future Ready',
    copy: 'Creating connected travel experiences of tomorrow',
    icon: (
      <path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z M15.6 8.4l-1.9 5.3-5.3 1.9 1.9-5.3 5.3-1.9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
]

export async function PartnersSection() {
  const partners = await getPublicPartners()
  if (partners.length === 0) return null

  return (
    <section className="partners-section">
      {/* Faint dotted world map, route arcs and destination pins from the
          reference. Purely decorative, so it's hidden from assistive tech. */}
      <div className="partners-decor" aria-hidden="true">
        <div className="partners-dots" />
        <svg className="partners-routes" viewBox="0 0 1440 620" preserveAspectRatio="none">
          <path d="M-20 372 C 80 300, 180 262, 268 250" />
          <path d="M1172 250 C 1260 262, 1360 300, 1460 372" />
        </svg>
        <span className="partners-pin partners-pin-left" />
        <span className="partners-pin partners-pin-right" />
      </div>

      <div className="partners-inner">
        <p className="partners-eyebrow">
          <span aria-hidden="true">🤝</span> Collaborate
        </p>

        {/* Explicit break reproduces the reference's two-line balance
            ("Innovation in travel" / "thrives through collaboration");
            it's suppressed below tablet where natural wrapping reads better. */}
        <h2 className="partners-heading">
          Innovation in travel <br className="partners-heading-break" />
          thrives through <span className="partners-heading-accent">collaboration</span>
        </h2>

        <p className="partners-lead">
          Building the future of travel requires collaboration across technology, tourism, hospitality, and
          innovation. We are proud to work with organizations that share our vision of creating smarter, more
          connected travel experiences.
        </p>

        <p className="partners-label">
          <span>Trusted By &amp; Working With</span>
        </p>

        <div className="partners-logos">
          {partners.map((partner) => {
            const partnerSlug = partner.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const content = partner.logo?.url ? (
              <span className={`partners-logo-box partner-logo-${partnerSlug}`}>
                <Image
                  src={partner.logo.url}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 230px"
                />
              </span>
            ) : (
              <span className="partner-name-fallback">{partner.name}</span>
            )

            return partner.url ? (
              <a key={partner._id} className={`partner-card partner-card-${partnerSlug}`} href={partner.url} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={partner._id} className={`partner-card partner-card-${partnerSlug}`}>
                {content}
              </div>
            )
          })}
        </div>

        <div className="partners-values">
          {PARTNER_VALUES.map((value) => (
            <div className="partner-value" key={value.title}>
              <span className="partner-value-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">{value.icon}</svg>
              </span>
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </div>
          ))}
        </div>

        <PartnerWithUsButton />
      </div>
    </section>
  )
}
