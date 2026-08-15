'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type PaginationProps = {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Generate page number sequence with ellipsis for large page counts
  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav className="pagination-wrap" aria-label="Pagination Navigation">
      {currentPage > 1 ? (
        <Link className="pagination-btn prev" href={createPageUrl(currentPage - 1)}>
          ← Prev
        </Link>
      ) : (
        <span className="pagination-btn prev disabled">← Prev</span>
      )}

      <div className="pagination-numbers">
        {pages.map((p, idx) =>
          typeof p === 'number' ? (
            <Link
              key={p}
              href={createPageUrl(p)}
              className={`pagination-num ${p === currentPage ? 'active' : ''}`}
            >
              {p}
            </Link>
          ) : (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              …
            </span>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link className="pagination-btn next" href={createPageUrl(currentPage + 1)}>
          Next →
        </Link>
      ) : (
        <span className="pagination-btn next disabled">Next →</span>
      )}
    </nav>
  )
}
