'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, Sparkles } from 'lucide-react'

type Category = { _id: string; name: string; slug: string }

export function BlogCategoryFilter({
  categories,
  activeCategory,
}: {
  categories: Category[]
  activeCategory?: string
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Find active category object
  const currentCategory = categories.find((c) => c.slug === activeCategory)
  const currentLabel = currentCategory ? currentCategory.name : 'All Categories'

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (slug: string) => {
    setIsOpen(false)
    if (slug === 'all') {
      router.push('/blog')
    } else {
      router.push(`/blog/category/${slug}`)
    }
  }

  return (
    <section className="blog-category-bar">
      {/* Mobile Custom Select Dropdown */}
      <div className="blog-mobile-filter-wrap relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Filter categories"
          className="blog-custom-dropdown-btn"
        >
          <span className="blog-dropdown-label flex items-center gap-2 truncate">
            {!activeCategory && <Sparkles className="h-3.5 w-3.5 text-[#ec2a8b] shrink-0" />}
            {currentLabel}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#ec2a8b] transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="blog-custom-dropdown-menu">
            <div className="blog-custom-dropdown-list">
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={`blog-custom-dropdown-item ${!activeCategory ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#ec2a8b]" />
                  All Categories
                </span>
                {!activeCategory && <Check className="h-4 w-4 text-[#ec2a8b]" />}
              </button>
              <div className="blog-dropdown-divider" />
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.slug
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleSelect(cat.slug)}
                    className={`blog-custom-dropdown-item ${isSelected ? 'active' : ''}`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-[#ec2a8b]" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Horizontal Snap Pills */}
      <div className="category-scroll-container blog-desktop-pills">
        <Link href="/blog" className={`category-tab${!activeCategory ? ' active' : ''}`}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/blog/category/${cat.slug}`}
            className={`category-tab${activeCategory === cat.slug ? ' active' : ''}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
