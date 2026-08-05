import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { ImmersiveBooking } from '@/components/sections/ImmersiveBooking'
import { PlatformSlides } from '@/components/sections/PlatformSlides'
import { ClarityIntel } from '@/components/sections/ClarityIntel'
import { AdvantageGrid } from '@/components/sections/AdvantageGrid'
import { CompanionModules } from '@/components/sections/CompanionModules'
import { ClosingCta } from '@/components/sections/ClosingCta'
import { PartnersSection } from '@/components/sections/PartnersSection'

// Title/description are inherited from the root layout's default (they
// already match the live site's <title>/<meta description> exactly) —
// only the canonical needs to be set here since every other route sets
// its own.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Section order (client-approved reorder — see conversation/commit history,
// not a straight port of the original site's sequence): grouped by
// narrative role rather than the original arbitrary order —
//   1-3 Hero + two feature demos (ImmersiveBooking, PlatformSlides)
//   4   ClarityIntel — capability summary / transition
//   5   AdvantageGrid — "why trust us"
//   6   CompanionModules — biggest interactive demo, saved for late
//   7   PartnersSection — trust signal, right before the ask
//   8   ClosingCta — the final CTA, last thing before the footer
// The Technology Showcase moved to /product (client request — the homepage
// was too long, and that deep tech narrative suits the product page's
// audience better); it now lives there as the tech-tile grid.
// Footer renders from (public)/layout.tsx so it appears on every public
// page, not just here.
export default function Home() {
  return (
    <main>
      <Hero />
      <ImmersiveBooking />
      <PlatformSlides />
      <ClarityIntel />
      <AdvantageGrid />
      <CompanionModules />
      <PartnersSection />
      <ClosingCta />
    </main>
  )
}
