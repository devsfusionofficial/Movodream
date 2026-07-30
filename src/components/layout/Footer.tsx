'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ComingSoonModal } from './ComingSoonModal'

export type FooterOffice = {
  _id: string
  city: string
  slug: string
  status: 'live' | 'comingSoon'
}

/** Ported from index.html's <footer class="movodream-footer"> (lines 1396–1465). */
export function Footer({ offices = [] }: { offices?: FooterOffice[] }) {
  const [comingSoonOpen, setComingSoonOpen] = useState(false)

  return (
    <>
      <footer className="movodream-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo">
              <div className="logo-icon">
                <Link href="/">
                  <Image src="/assets/images/logo.png" alt="movodream logo" width={120} height={85} />
                </Link>
              </div>
            </div>

            <div className="footer-links">
              <Link href="/privacy-policy">PRIVACY</Link>
              <Link href="/terms">TERMS</Link>
              <Link href="/support">SUPPORT</Link>
            </div>

            <h3 className="shutter-cta-h3 ftr">Coming Soon!</h3>
          </div>

          {offices.length > 0 && (
            <div className="footer-offices">
              <p className="footer-offices-title">Our Offices</p>
              <div className="footer-offices-list">
                {offices.map((office) =>
                  office.status === 'live' ? (
                    <Link key={office._id} href={`/offices/${office.slug}`} className="footer-office-item">
                      <span className="footer-office-city">{office.city}</span>
                    </Link>
                  ) : (
                    <span key={office._id} className="footer-office-item">
                      <span className="footer-office-city">{office.city}</span>
                      <span className="footer-office-status">Coming Soon</span>
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          <div className="footer-bottom">
            <div className="social-icons">
              <button type="button" className="social-icon" onClick={() => setComingSoonOpen(true)}>
                <i className="fa-brands fa-x-twitter" />
              </button>
              <button type="button" className="social-icon" onClick={() => setComingSoonOpen(true)}>
                <i className="fa-brands fa-instagram" />
              </button>
              <button type="button" className="social-icon" onClick={() => setComingSoonOpen(true)}>
                <i className="fa-brands fa-linkedin" />
              </button>
              <button type="button" className="social-icon" onClick={() => setComingSoonOpen(true)}>
                <i className="fa-brands fa-facebook" />
              </button>
            </div>

            <div className="copyright">© 2025 MOVODREAM</div>

            <div className="global-support">
              <span className="status-dot" />
              GLOBAL SUPPORT ACTIVE
            </div>
          </div>
        </div>
      </footer>

      <ComingSoonModal open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />
    </>
  )
}
