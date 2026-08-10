'use client'

import { useState } from 'react'

/**
 * Sticky share rail in the article's left margin.
 *
 * Only actions that actually work are shown — the reference mock also has a
 * bookmark button, but there is no saved-articles feature on this site, so a
 * dead control would be worse than its absence.
 */
export function ArticleShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard is unavailable over plain HTTP and in some embedded
      // browsers; silently leave the button in its resting state.
    }
  }

  return (
    <aside className="article-rail" aria-label="Share this article">
      <span className="article-rail-label">Share</span>

      <a
        className="article-rail-btn"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <i className="fa-brands fa-x-twitter" />
      </a>

      <a
        className="article-rail-btn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <i className="fa-brands fa-linkedin-in" />
      </a>

      <button
        type="button"
        className={`article-rail-btn${copied ? ' is-copied' : ''}`}
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-link'} />
      </button>

      {copied && <span className="article-rail-toast">Copied</span>}
    </aside>
  )
}
