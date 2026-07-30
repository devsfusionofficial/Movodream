import Link from 'next/link'
import type { Metadata } from 'next'
import { getFeaturedPosts, getLatestPosts, getAllCategories, searchPosts } from '@/lib/queries/posts'
import { PostCard } from './post-card'

export const metadata: Metadata = {
  title: 'Blog | Movodream',
  description: 'Ideas on AI travel, itinerary planning, and the future of travel technology from the Movodream team.',
  alternates: { canonical: '/blog' },
}

type PageProps = { searchParams: Promise<{ q?: string }> }

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const categories = await getAllCategories()

  if (q?.trim()) {
    const results = await searchPosts(q)
    return (
      <>
        <section className="content-hero">
          <h1>Blog</h1>
          <p>{results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;</p>
        </section>

        <main className="content-body" style={{ maxWidth: 1100 }}>
          <BlogToolbar categories={categories} activeQuery={q} />
          {results.length === 0 ? (
            <div className="blog-empty">No posts matched your search.</div>
          ) : (
            <div className="blog-grid">
              {results.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </main>
      </>
    )
  }

  const [featured, latest] = await Promise.all([getFeaturedPosts(3), getLatestPosts({ limit: 9 })])
  const featuredIds = new Set(featured.map((p) => p._id))
  const rest = latest.filter((p) => !featuredIds.has(p._id))

  return (
    <>
      <section className="content-hero">
        <h1>Movodream Blog</h1>
        <p>Ideas on AI travel, itinerary planning, and the future of travel technology.</p>
      </section>

      <main className="content-body" style={{ maxWidth: 1100 }}>
        <BlogToolbar categories={categories} />

        {featured.length === 0 ? (
          <div className="blog-empty">No posts published yet — check back soon.</div>
        ) : (
          <>
            <div className="blog-grid featured">
              {featured.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}

function BlogToolbar({
  categories,
  activeCategory,
  activeQuery,
}: {
  categories: Awaited<ReturnType<typeof getAllCategories>>
  activeCategory?: string
  activeQuery?: string
}) {
  return (
    <div className="blog-toolbar">
      <div className="blog-categories">
        <Link href="/blog" className={`blog-category-pill${!activeCategory ? ' active' : ''}`}>
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/blog/category/${category.slug}`}
            className={`blog-category-pill${activeCategory === category.slug ? ' active' : ''}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <form action="/blog" method="get">
        <input type="search" name="q" placeholder="Search posts…" defaultValue={activeQuery} className="blog-search" />
      </form>
    </div>
  )
}
