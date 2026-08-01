'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/components/animation/SmoothScrollProvider'
import { useOpenContactModal } from '@/components/layout/ContactModal'

const NAV_ITEMS = [
  { href: '#platform', label: 'Platform' },
  { href: '#vision', label: 'Vision' },
  { href: '#advantage', label: 'Advantage' },
  { href: '#ecosystem', label: 'Ecosystem' },
]

/**
 * Ported from the live site's nav markup + script.js: scroll-spy
 * (ScrollTrigger per section[id], toggling .active on the matching link)
 * and the hamburger open/close animation (lines 2219–2271 of script.js).
 * Below 1149px the live site switches to the hamburger; matches the
 * `@media (max-width: 1149px)` rule in styles.css.
 */
export function Header() {
  const navRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const navMenuRef = useRef<HTMLUListElement>(null)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lenisRef = useLenis()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const openContactModal = useOpenContactModal()

  useGSAP(() => {
    if (!isHome) return
    gsap.registerPlugin(ScrollTrigger)
    const sections = document.querySelectorAll('section[id]')

    const triggers = Array.from(sections).map((section) =>
      ScrollTrigger.create({
        trigger: section,
        scroller: document.body,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActiveHref(`#${section.id}`)
        },
      })
    )

    return () => triggers.forEach((t) => t.kill())
  }, [isHome])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (!target) return

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2, force: true })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }

    if (mobileOpen) closeMobileMenu()
  }

  function openMobileMenu() {
    setMobileOpen(true)
    const navMenu = navMenuRef.current
    const hamburger = hamburgerRef.current
    if (!navMenu || !hamburger) return

    gsap.fromTo(navMenu, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    gsap.fromTo(
      navMenu.querySelectorAll('li'),
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
    )
    gsap.fromTo(
      document.querySelectorAll('.nav-right-mobile button'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.4, ease: 'power2.out' }
    )
    gsap.to(hamburger, {
      position: 'fixed',
      right: 16,
      top: 20,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => hamburger.classList.add('cross'),
    })
  }

  function closeMobileMenu() {
    const navMenu = navMenuRef.current
    const hamburger = hamburgerRef.current
    if (!navMenu || !hamburger) return

    hamburger.classList.remove('cross')
    gsap.to(navMenu, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setMobileOpen(false)
        gsap.set(navMenu, { opacity: 1 })
        gsap.set(hamburger, { position: 'relative', left: 'auto', top: 'auto', x: 0, y: 0 })
      },
    })
    gsap.to(navMenu.querySelectorAll('li'), {
      y: -10,
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
      ease: 'power2.in',
    })
  }

  return (
    <nav ref={navRef} className="flex w-full items-center justify-between bg-white px-[4.2%] py-4">
      <Link href="/">
        <Image src="/assets/images/logo2.webp" alt="Movodream logo" width={140} height={36} className="h-9 w-auto" priority />
      </Link>

      <ul
        ref={navMenuRef}
        className={`nav-menu${mobileOpen ? ' mobile-open' : ''}`}
        style={{
          listStyle: 'none',
          display: mobileOpen ? 'flex' : undefined,
        }}
      >
        {NAV_ITEMS.map((item) =>
          isHome ? (
            <li key={item.href}>
              <a
                href={item.href}
                className={activeHref === item.href ? 'active' : ''}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.href}>
              <Link href={`/${item.href}`}>{item.label}</Link>
            </li>
          )
        )}
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/careers">Careers</Link>
        </li>
        <div className="nav-right-mobile">
          <button type="button" className="qzv-launcher" onClick={openContactModal}>
            Start Planning
          </button>
        </div>
      </ul>

      <div className="nav-right flex items-center gap-3">
        <button type="button" className="nav-planning qzv-launcher" onClick={openContactModal}>
          Start Planning
        </button>
        <button
          ref={hamburgerRef}
          type="button"
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => (mobileOpen ? closeMobileMenu() : openMobileMenu())}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
