import { Hero } from '@/components/sections/Hero'
import { ImmersiveBooking } from '@/components/sections/ImmersiveBooking'
import { PlatformSlides } from '@/components/sections/PlatformSlides'
import { ClarityIntel } from '@/components/sections/ClarityIntel'
import { AdvantageArc } from '@/components/sections/AdvantageArc'
import { CompanionModules } from '@/components/sections/CompanionModules'
import { ClosingCta } from '@/components/sections/ClosingCta'
import { TechnologyShowcase } from '@/components/sections/TechnologyShowcase'
import { PartnersSection } from '@/components/sections/PartnersSection'

// Real 12-section homepage — see docs/01-architecture.md §3 for the full
// section order. Hero + ImmersiveBooking + PlatformSlides + ClarityIntel +
// AdvantageArc + CompanionModules + ClosingCta are the original site's
// sections (Phase 1). Technology Showcase / Partners are new client-brief
// additions (Phase 3) placed after them; Footer now renders from
// (public)/layout.tsx so it appears on every public page, not just here.
export default function Home() {
  return (
    <main>
      <Hero />
      <ImmersiveBooking />
      <PlatformSlides />
      <ClarityIntel />
      <AdvantageArc />
      <CompanionModules />
      <ClosingCta />
      <TechnologyShowcase />
      <PartnersSection />
    </main>
  )
}
