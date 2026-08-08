import Link from 'next/link'
import type { Metadata } from 'next'
import { getFeaturedPosts, getLatestPosts, getAllCategories, searchPosts } from '@/lib/queries/posts'
import { PostCard } from './post-card'
import { BlogToolbar } from './blog-toolbar'

export const metadata: Metadata = {
  title: 'Blog | Movodream',
  description: 'Ideas on AI travel, itinerary planning, and the future of travel technology from the Movodream team.',
  alternates: { canonical: '/blog' },
}

type PageProps = { searchParams: Promise<{ q?: string }> }

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const categories = await getAllCategories()
  const query = q?.trim()

  const [featured, latest, results] = await Promise.all([
    query ? Promise.resolve([]) : getFeaturedPosts(3),
    query ? Promise.resolve([]) : getLatestPosts({ limit: 9 }),
    query ? searchPosts(query) : Promise.resolve([]),
  ])

  const featuredIds = new Set(featured.map((post) => post._id))
  const rest = latest.filter((post) => !featuredIds.has(post._id))

  return (
    <div className="page-shell">
      <section className="page-crumb">
        <Link href="/">Home</Link> › <span>Blog</span>
      </section>

      <section className="page-head">
        <span className="page-eyebrow">Movodream Journal</span>
        <h1>
          Ideas on the future of <span className="p">intelligent travel.</span>
        </h1>
        <p className="page-head-lead">
          Thinking on AI travel, itinerary planning, and the technology reshaping how people explore the world.
        </p>
      </section>

      <main className="page-main">
        <BlogToolbar categories={categories} activeQuery={query} />

        {query ? (
          results.length === 0 ? (
            <div className="page-empty">No posts matched “{query}”.</div>
          ) : (
            <>
              <p className="post-tile-meta" style={{ marginBottom: 18 }}>
                {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
              </p>
              <div className="post-grid">
                {results.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </>
          )
        ) : featured.length === 0 && rest.length === 0 ? (
          <div className="page-empty">No posts published yet — check back soon.</div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="post-grid is-featured">
                {featured.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
            {rest.length > 0 && (
              <div className="post-grid">
                {rest.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
