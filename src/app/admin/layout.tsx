import { Manrope } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={manrope.className + ' min-h-screen'}>{children}</div>
}
