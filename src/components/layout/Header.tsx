'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/animation/SmoothScrollProvider'
import { useOpenContactModal } from '@/components/layout/ContactModal'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/product', label: 'Product' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Career' },
  { href: '/about', label: 'About Us' },
]

export function Header() {
  const navRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lenisRef = useLenis()
  const pathname = usePathname()
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

  function isItemActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-[500] flex w-full items-center justify-between bg-white px-[4.2%] py-4"
      >
        <Link href="/">
          <Image
            src="/assets/images/logo-header.webp"
            alt="Movodream logo"
            width={160}
            height={32}
            className="h-8 w-auto object-contain"
            style={{ width: 'auto', height: '32px' }}
            priority
          />
        </Link>

        {/* Desktop Nav Items */}
        <ul className="nav-menu hidden items-center gap-6 lg:flex" style={{ listStyle: 'none' }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isItemActive(item.href) ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right flex items-center gap-3">
          <button type="button" className="nav-planning qzv-launcher" onClick={openContactModal}>
            Get in Touch
          </button>
          {!mobileOpen && (
            <button
              type="button"
              className="hamburger flex items-center justify-center lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#241a3e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer Portal */}
      {mobileOpen &&
        mounted &&
        createPortal(
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-header">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/assets/images/logo-header.webp"
                  alt="Movodream logo"
                  width={140}
                  height={28}
                  className="h-7 w-auto object-contain"
                  style={{ width: 'auto', height: '28px' }}
                  priority
                />
              </Link>
              <button
                type="button"
                className="mobile-menu-close"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ec2a8b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="mobile-menu-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isItemActive(item.href) ? 'active' : ''}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-right-mobile">
              <button
                type="button"
                className="qzv-launcher mobile-cta-btn"
                onClick={() => {
                  setMobileOpen(false)
                  openContactModal()
                }}
              >
                Get in Touch
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
