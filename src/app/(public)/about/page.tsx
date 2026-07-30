import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Movodream',
  description:
    'Movodream is a travel technology and innovation company building intelligent digital experiences for the next generation of travelers.',
  alternates: { canonical: '/about' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Movodream',
  url: 'https://movodream.com/about',
  about: { '@type': 'Organization', name: 'Movodream' },
}

// Copy is the drafted content from the client's content doc, used verbatim.
export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="content-hero">
        <h1>About Us</h1>
        <p>
          Movodream is a travel technology and innovation company building intelligent digital experiences for the
          next generation of travelers.
        </p>
      </section>

      <main className="content-body">
        <p>
          By combining AI, contextual intelligence, and user-centric design, we create solutions that make travel
          more intuitive, personalized, and connected.
        </p>

        <h2>Why We Exist</h2>
        <p>
          Travel has evolved, but the way people plan, navigate, and experience destinations remains fragmented.
          Movodream exists to bridge these gaps through technology, enabling travelers to explore with greater
          confidence, convenience, and deeper cultural connection.
        </p>

        <h2>Our Vision</h2>
        <p>
          <strong>A World Where Travel Plans Itself.</strong> Imagine trips that organize themselves as effortlessly
          as daydreams. Where we handle the how, so you only feel the wonder. No stress, no spreadsheets — just pure
          discovery and those perfect moments when a place transforms you forever.
        </p>

        <h2>Built in India. Driving Global Travel Innovation.</h2>
        <p>
          With offices in Delhi, Mumbai, and Amritsar, Movodream combines nationwide expertise with a global vision.
          Our presence across India fuels the development of intelligent travel technologies that connect people,
          destinations, and businesses through seamless, AI-powered experiences designed for the future of travel.
        </p>
      </main>
    </>
  )
}
