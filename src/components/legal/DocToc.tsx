'use client'

import { useEffect, useRef, useState } from 'react'

export type TocEntry = { id: string; title: string }

/**
 * "On this page" nav with scroll-spy highlighting.
 *
 * Uses IntersectionObserver with a top-weighted rootMargin so a section
 * counts as current once its heading reaches the upper third of the
 * viewport — matching how the reader is actually reading, rather than
 * flipping the moment a section's last line scrolls past.
 */
export function DocToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? '')
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-12% 0px -70% 0px', threshold: 0 }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [entries])

  // Keep the highlighted entry inside the list's own scroll window. Once the
  // list is taller than the pinned column it scrolls internally, so by the
  // time the reader reaches section 10+ the highlight sits below the fold and
  // there's no way to tell which entry is current.
  //
  // Deliberately not scrollIntoView(): that walks up and scrolls every
  // scrollable ancestor, including the page — which would fight Lenis and
  // yank the document. This moves only the list, and only when the entry is
  // actually out of view, so a highlight that's already visible stays put.
  useEffect(() => {
    const list = listRef.current
    if (!list || !activeId) return

    const link = list.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`)
    if (!link) return

    const pad = 10
    const top = link.offsetTop
    const bottom = top + link.offsetHeight
    const viewTop = list.scrollTop
    const viewBottom = viewTop + list.clientHeight

    const target = top < viewTop + pad ? top - pad : bottom > viewBottom - pad ? bottom - list.clientHeight + pad : null
    if (target === null) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ top: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' })
  }, [activeId])

  return (
    <nav className="doc-card doc-toc-card" aria-label="On this page">
      <h2>On this page</h2>
      {/* data-lenis-prevent sits on the list, not the whole column: it hands
          wheel events back to the browser, so it must cover the smallest
          region that actually scrolls. On the column it also swallowed
          scrolls aimed at the page. */}
      <ol className="doc-toc" ref={listRef} data-lenis-prevent>
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} aria-current={entry.id === activeId ? 'true' : undefined}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span>{entry.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
