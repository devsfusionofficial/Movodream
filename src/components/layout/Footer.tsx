import Image from 'next/image'
import Link from 'next/link'
import { NewsletterForm } from './NewsletterForm'

const SOCIAL_LINKS = [
  { href: 'https://x.com/movodream', label: 'X (Twitter)', icon: 'fa-x-twitter' },
  { href: 'https://www.instagram.com/movodreamofficial/', label: 'Instagram', icon: 'fa-instagram' },
  { href: 'https://www.linkedin.com/company/movodream', label: 'LinkedIn', icon: 'fa-linkedin' },
  { href: 'https://www.facebook.com/movodreamofficial/', label: 'Facebook', icon: 'fa-facebook' },
]

export function Footer() {
  return (
    <footer className="movodream-footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-col footer-col-brand">
            <Link href="/" className="footer-logo-link">
              <Image src="/assets/images/logo2.webp" alt="Movodream logo" width={150} height={39} style={{ width: '150px', height: '39px' }} />
            </Link>
            <p className="footer-tagline">
              Your AI travel companion — smarter planning, live guidance, and one connection to everything your trip
              needs.
            </p>
            <div className="social-icons">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.label}
                >
                  <i className={`fa-brands ${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-col-title">Product</p>
            <Link href="/product">Overview</Link>
            <Link href="/product#features">Features</Link>
            <Link href="/product#technology">Technology</Link>
          </div>

          <div className="footer-col">
            <p className="footer-col-title">Company</p>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/careers">Careers</Link>
          </div>

          <div className="footer-col">
            <p className="footer-col-title">Legal</p>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/cancellation-policy">Cancellation Policy</Link>
            <Link href="/support">Support</Link>
          </div>

          <div className="footer-col footer-newsletter-col">
            <div className="footer-newsletter-heading">
              <span className="footer-newsletter-icon">
                <i className="fa-solid fa-paper-plane" />
              </span>
              <p className="footer-newsletter-card-title">Stay in the loop</p>
            </div>
            <p className="footer-newsletter-sub">
              Get travel and product updates. Occasional news, no spam.
            </p>
            <NewsletterForm />
            <div className="social-icons social-icons-mobile">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.label}
                >
                  <i className={`fa-brands ${social.icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">© 2026 MOVODREAM. All rights reserved.</div>
          <p className="footer-tagline-bottom">
            <i className="fa-solid fa-heart" /> Built with AI. For explorers like you.
          </p>
          <div className="global-support">\n            <span className="status-dot" />\n            GLOBAL SUPPORT ACTIVE\n          </div>
        </div>
      </div>
    </footer>
  )
}
