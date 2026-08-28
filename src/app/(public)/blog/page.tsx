import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { getLatestPosts, getAllCategories, getPublishedPostsCount, searchPosts } from '@/lib/queries/posts'
import { Pagination } from '@/components/ui/Pagination'

import { BlogCategoryFilter } from './category-filter'

export const metadata: Metadata = {
  title: 'Blog & Journal | Movodream',
  description: 'Ideas on AI travel, itinerary planning, and the future of travel technology from the Movodream team.',
  alternates: { canonical: '/blog' },
}

type PageProps = { searchParams: Promise<{ q?: string; page?: string }> }

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const { q, page: rawPage } = await searchParams
  const query = q?.trim()
  const page = Math.max(1, parseInt(rawPage || '1', 10))
  const limit = 6
  const skip = (page - 1) * limit

  const [categories, posts, totalPosts, results] = await Promise.all([
    getAllCategories(),
    query ? Promise.resolve([]) : getLatestPosts({ skip, limit }),
    getPublishedPostsCount(),
    query ? searchPosts(query) : Promise.resolve([]),
  ])

  const totalPages = Math.ceil(totalPosts / limit)
  const displayPosts = query ? results : posts

  return (
    <div className="page-shell blog-page-container">
      {/* ---------- Hero Section ---------- */}
      <section className="blog-hero-section">
        <div className="blog-hero-content">
          <span className="blog-eyebrow">MOVODREAM JOURNAL</span>
          <h1>
            Ideas on the future of <span className="gradient-text">intelligent travel.</span>
          </h1>
          <p className="blog-hero-lead">
            Exploring how AI, technology, and human curiosity are shaping the way we plan, travel, and experience the world.
          </p>

          <form action="/blog" method="get" className="blog-search-form">
            <input
              type="search"
              name="q"
              placeholder="Search articles..."
              defaultValue={query}
              aria-label="Search articles"
              className="blog-search-input"
            />
            <button type="submit" className="blog-search-btn" aria-label="Submit search">
              🔍
            </button>
          </form>
        </div>

        <div className="blog-hero-visual">
          <div className="mascot-glow-backdrop" />
          <div className="mascot-image-wrap">
            <Image
              src="/assets/images/blog_hero_mascot.jpg"
              alt="Movodream AI Travel Companion"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              className="mascot-img"
            />
          </div>
          <div className="floating-badge badge-1">🧠</div>
          <div className="floating-badge badge-2">✈️</div>
          <div className="floating-badge badge-3">📅</div>
        </div>
      </section>

      {/* ---------- Category Filter Bar ---------- */}
      <BlogCategoryFilter categories={categories} />

      <main className="page-main blog-main-content">
        {query && results.length === 0 ? (
          <div className="page-empty">No articles matched “{query}”.</div>
        ) : displayPosts.length === 0 ? (
          <div className="page-empty">No articles published yet — check back soon.</div>
        ) : (
          <>
            {query && (
              <p className="search-summary-text" style={{ marginBottom: 20 }}>
                Showing {results.length} article{results.length === 1 ? '' : 's'} for “{query}”
              </p>
            )}

            {/* ---------- Full-Width 3-Column Articles Grid ---------- */}
            <div className="featured-grid">
              {displayPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="featured-card">
                  <div className="featured-card-media">
                    {post.heroImage?.url ? (
                      <Image
                        src={post.heroImage.url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      />
                    ) : (
                      <div className="media-placeholder" />
                    )}
                  </div>
                  <div className="featured-card-body">
                    {post.categories?.[0] && (
                      <span className="category-badge">{post.categories[0].name}</span>
                    )}
                    <h3>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <div className="featured-card-footer">
                      <div className="card-meta-wrap">
                        {post.author?.name && (
                          <div className="author-pill">
                            {post.author.avatar ? (
                              <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={18}
                                height={18}
                                className="author-avatar-img"
                              />
                            ) : (
                              <span className="author-initial">{post.author.name.charAt(0).toUpperCase()}</span>
                            )}
                            <span className="author-name">By {post.author.name}</span>
                          </div>
                        )}
                        <span className="meta-text">
                          {(post.publishedAt || post.createdAt) && (
                            <>
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}{' '}
                              •{' '}
                            </>
                          )}
                          {post.readingTime ?? 5} min read
                        </span>
                      </div>
                      <span className="card-arrow-btn">
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ---------- Pagination Controls ---------- */}
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </main>
    </div>
  )
}
