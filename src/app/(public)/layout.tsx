import { Manrope } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/animation/SmoothScrollProvider'
import { ExploreAppModalProvider } from '@/components/layout/ExploreAppModal'
import { ContactModalProvider } from '@/components/layout/ContactModal'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ComingSoonShutter } from '@/components/layout/ComingSoonShutter'
import { getPublicOffices } from '@/lib/queries/offices'
import '@/styles/homepage.css'

// Live site loads Manrope 200–800 via Google Fonts CDN; next/font self-hosts
// the same variable range with no extra network request and no CLS.
const manrope = Manrope({ subsets: ['latin'], weight: ['200', '300', '400', '500', '600', '700', '800'] })

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const offices = await getPublicOffices()

  return (
    <div className={manrope.className}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <SmoothScrollProvider>
        <ContactModalProvider>
          <ExploreAppModalProvider>
            <Header />
            {children}
            <Footer offices={offices} />
            <ComingSoonShutter />
          </ExploreAppModalProvider>
        </ContactModalProvider>
      </SmoothScrollProvider>
    </div>
  )
}
