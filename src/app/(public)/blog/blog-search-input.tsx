'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Loader2, X } from 'lucide-react'

type BlogSearchInputProps = {
  initialQuery?: string
}

export function BlogSearchInput({ initialQuery = '' }: BlogSearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const isFocusedRef = useRef(false)
  const lastPushedQueryRef = useRef<string>(initialQuery.trim())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync state ONLY when the input is NOT focused (e.g. browser back/forward button or external navigation)
  // This completely eliminates the race condition where delayed router responses wipe out active typing.
  const currentUrlQuery = (searchParams.get('q') || '').trim()
  useEffect(() => {
    if (!isFocusedRef.current) {
      setValue(currentUrlQuery)
      lastPushedQueryRef.current = currentUrlQuery
    }
  }, [currentUrlQuery])

  const navigateToQuery = (targetQuery: string, usePush = false) => {
    const trimmed = targetQuery.trim()
    // Avoid redundant navigation if already matching the last dispatched query
    if (trimmed === lastPushedQueryRef.current) return

    lastPushedQueryRef.current = trimmed

    const params = new URLSearchParams(searchParams.toString())
    if (trimmed) {
      params.set('q', trimmed)
      params.delete('page')
    } else {
      params.delete('q')
      params.delete('page')
    }

    const qs = params.toString()
    const target = qs ? `${pathname}?${qs}` : pathname

    startTransition(() => {
      if (usePush) {
        router.push(target, { scroll: false })
      } else {
        router.replace(target, { scroll: false })
      }
    })
  }

  // Handle typing with clean timer cancellation and debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setValue(newVal)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      navigateToQuery(newVal, false)
    }, 350)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    navigateToQuery(value, true)
  }

  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setValue('')
    inputRef.current?.focus()
    navigateToQuery('', false)
  }

  return (
    <form onSubmit={handleSubmit} className="blog-search-form" role="search">
      <input
        ref={inputRef}
        type="text"
        name="q"
        placeholder="Search articles..."
        value={value}
        onChange={handleChange}
        onFocus={() => {
          isFocusedRef.current = true
        }}
        onBlur={() => {
          isFocusedRef.current = false
        }}
        aria-label="Search articles"
        className="blog-search-input"
        style={value ? { paddingRight: '74px' } : undefined}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded-full text-[#7d6b84] hover:text-[#2b2032] hover:bg-black/5 transition-colors cursor-pointer"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="submit"
        className="blog-search-btn flex items-center justify-center"
        aria-label="Submit search"
        title={isPending ? 'Searching...' : 'Search'}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#ec2a8b]" />
        ) : (
          <Search className="h-4.5 w-4.5 text-[#8b5cf6] hover:text-[#ec2a8b] transition-colors" />
        )}
      </button>
    </form>
  )
}
