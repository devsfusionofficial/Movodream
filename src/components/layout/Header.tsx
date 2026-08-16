'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/components/animation/SmoothScrollProvider'
import { useOpenContactModal } from '@/components/layout/ContactModal'
import { markNavClick } from '@/lib/section-nav-guard'

const NAV_ITEMS = [
  { href: '#platform', label: 'Platform' },
  { href: '#vision', label: 'Vision' },
  { href: '#advantage', label: 'Advantage' },
  { href: '#ecosystem', label: 'Ecosystem' },
]

export function Header() {
  const navRef = useRef<HTMLElement>(null)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lenisRef = useLenis()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const openContactModal = useOpenContactModal()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      lenisRef.current?.stop()
    } else {
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }
    return () => {
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }
  }, [mobileOpen, lenisRef])

  useGSAP(() => {
    if (!isHome) return
    gsap.registerPlugin(ScrollTrigger)
    const sections = NAV_ITEMS.map((item) => document.querySelector<HTMLElement>(item.href)).filter(
      (el): el is HTMLElement => el !== null
    )

    function updateActiveSection() {
      const centerY = window.innerHeight / 2
      let current: HTMLElement | null = null
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= centerY) current = section
      }
      setActiveHref(current ? `#${current.id}` : null)
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    ScrollTrigger.addEventListener('refresh', updateActiveSection)
    updateActiveSection()

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      ScrollTrigger.removeEventListener('refresh', updateActiveSection)
    }
  }, [isHome])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (!target) return

    markNavClick()

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2, force: true })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }

    if (mobileOpen) setMobileOpen(false)
  }

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-[500] flex w-full items-center justify-between bg-white px-[4.2%] py-4"
      >
        <Link href="/">
          <Image src="/assets/images/logo2.webp" alt="Movodream logo" width={140} height={36} className="h-9 w-auto" priority />
        </Link>

        {/* Desktop Nav Items */}
        <ul className="nav-menu hidden items-center gap-6 lg:flex" style={{ listStyle: 'none' }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              {isHome ? (
                <a
                  href={item.href}
                  className={activeHref === item.href ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ) : (
                <Link href={`/${item.href}`}>{item.label}</Link>
              )}
            </li>
          ))}
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/careers">Careers</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
        </ul>

        <div className="nav-right flex items-center gap-3">
          <button type="button" className="nav-planning qzv-launcher" onClick={openContactModal}>
            Start Planning
          </button>
          {!mobileOpen && (
            <button
              type="button"
              className="hamburger flex items-center justify-center lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#241a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer Portal */}
      {mobileOpen && mounted && createPortal(
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image src="/assets/images/logo2.webp" alt="Movodream logo" width={130} height={34} className="h-8 w-auto" priority />
            </Link>
            <button
              type="button"
              className="mobile-menu-close"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec2a8b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mobile-menu-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {isHome ? (
                  <a
                    href={item.href}
                    className={activeHref === item.href ? 'active' : ''}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={`/${item.href}`} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/blog" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" onClick={() => setMobileOpen(false)}>
                Careers
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMobileOpen(false)}>
                About Us
              </Link>
            </li>
          </div>

          <div className="nav-right-mobile">
            <button
              type="button"
              className="qzv-launcher mobile-cta-btn"
              onClick={() => {
                setMobileOpen(false)
                openContactModal()
              }}
            >
              Start Planning
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
