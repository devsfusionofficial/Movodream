'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDownIcon, SearchIcon } from '@/components/legal/icons'

export type Faq = { q: string; keywords: string; a: ReactNode }

/**
 * Help-centre search + FAQ.
 *
 * The search is scoped to what it can honestly cover: this site has no
 * search index and no results page, so instead of a box that silently does
 * nothing, it filters the FAQ live — matching the question plus a keyword
 * list, so "money back" finds the refund entry.
 *
 * Answers arrive as ReactNode props from the server component, which keeps
 * the policy links and their copy on the server.
 */
export function HelpSearchAndFaq({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqs
    return faqs.filter((f) => `${f.q} ${f.keywords}`.toLowerCase().includes(q))
  }, [query, faqs])

  return (
    <>
      <div className="help-search">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for articles, topics or questions…"
          aria-label="Search help topics"
        />
        <span className="help-search-go" aria-hidden="true">
          <SearchIcon />
        </span>
      </div>

      <h2 className="help-block-title" id="faq">
        Frequently Asked Questions
      </h2>

      <div className="help-faq">
        {matches.length === 0 ? (
          <p className="help-empty">
            No topics match &ldquo;{query}&rdquo;. Try different wording, or message our team — we&apos;re happy to
            help directly.
          </p>
        ) : (
          matches.map((faq) => (
            <details key={faq.q}>
              <summary>
                {faq.q}
                <ChevronDownIcon />
              </summary>
              <div className="help-faq-body doc-prose">{faq.a}</div>
            </details>
          ))
        )}
      </div>
    </>
  )
}
