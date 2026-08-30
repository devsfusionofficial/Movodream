import { Manrope } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/animation/SmoothScrollProvider'
import { ExploreAppModalProvider } from '@/components/layout/ExploreAppModal'
import { ContactModalProvider } from '@/components/layout/ContactModal'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/homepage.css'
import '@/styles/legal.css'
import '@/styles/about.css'
import '@/styles/pages.css'

// Live site loads Manrope 200–800 via Google Fonts CDN; next/font self-hosts
// the same variable range with no extra network request and no CLS.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={manrope.className}>
      <SmoothScrollProvider>
        <ContactModalProvider>
          <ExploreAppModalProvider>
            <Header />
            {children}
            <Footer />
          </ExploreAppModalProvider>
        </ContactModalProvider>
      </SmoothScrollProvider>
    </div>
  )
}
