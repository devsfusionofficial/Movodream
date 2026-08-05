import Link from 'next/link'
import type { ReactNode } from 'react'
import { HomeIcon } from './icons'

/**
 * Shared furniture for the documentation-style legal pages. Deliberately
 * plain: no cards or accordions around the content itself, so the copy reads
 * as one continuous document.
 */

export type Crumb = { label: string; href?: string }

export function DocBreadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="doc-breadcrumb" aria-label="Breadcrumb">
      <Link href="/" aria-label="Home">
        <HomeIcon />
      </Link>
      {trail.map((crumb, i) => (
        <span key={crumb.label} style={{ display: 'contents' }}>
          <span className="sep" aria-hidden="true">
            /
          </span>
          {crumb.href && i < trail.length - 1 ? (
            <Link href={crumb.href}>{crumb.label}</Link>
          ) : (
            <span aria-current="page">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/**
 * Pinned contents column. Nothing scrolls at this level — only the contents
 * list inside DocToc does, and that carries its own `data-lenis-prevent`.
 */
export function DocSidebar({ children }: { children: ReactNode }) {
  return <aside className="doc-sidebar">{children}</aside>
}

export type Highlight = { icon: ReactNode; title: string; copy: string }

export function DocHighlights({ items }: { items: Highlight[] }) {
  return (
    <div className="doc-highlights">
      {items.map((item) => (
        <div className="doc-highlight" key={item.title}>
          <span className="doc-highlight-icon">{item.icon}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export type DocSection = {
  /** Anchor id — also the React key and the scroll-spy target. */
  id: string
  title: string
  body: ReactNode
}

export function DocSections({ sections }: { sections: DocSection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <section className="doc-section" id={section.id} key={section.id}>
          <h2>
            <span className="num">{String(i + 1).padStart(2, '0')}.</span>
            {section.title}
          </h2>
          <div className="doc-prose">{section.body}</div>
        </section>
      ))}
    </>
  )
}

export function DocTip({ title = 'Tip', children }: { title?: string; children: ReactNode }) {
  return (
    <div className="doc-tip">
      <span className="doc-tip-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9.4 18.4h5.2 M10.2 21h3.6 M12 2.8a6 6 0 00-3.4 11c.5.4.8 1 .8 1.6h5.2c0-.6.3-1.2.8-1.6A6 6 0 0012 2.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  )
}
