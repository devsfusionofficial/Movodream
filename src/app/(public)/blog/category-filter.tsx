'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Category = { _id: string; name: string; slug: string }

export function BlogCategoryFilter({
  categories,
  activeCategory,
}: {
  categories: Category[]
  activeCategory?: string
}) {
  const router = useRouter()

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'all') {
      router.push('/blog')
    } else {
      router.push(`/blog/category/${value}`)
    }
  }

  return (
    <section className="blog-category-bar">
      {/* Mobile Select Dropdown */}
      <div className="blog-mobile-filter-wrap">
        <select
          value={activeCategory || 'all'}
          onChange={handleSelectChange}
          className="blog-mobile-select"
          aria-label="Filter by category"
        >
          <option value="all">⚡ All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
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
