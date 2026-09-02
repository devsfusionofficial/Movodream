import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getPostsByCategorySlug, getAllCategories } from '@/lib/queries/posts'

import { BlogCategoryFilter } from '../../category-filter'
import { formatDate } from '@/lib/date-format'

type PageProps = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params
  const { category } = await getPostsByCategorySlug(slug)
  if (!category) return {}

  return {
    title: `${category.name} | Movodream Blog`,
    description: `Deep dives, insights, and stories on ${category.name} from the Movodream team.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  }
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category: slug } = await params
  const [{ category, posts }, categories] = await Promise.all([
    getPostsByCategorySlug(slug),
    getAllCategories(),
  ])
  if (!category) notFound()

  return (
    <div className="page-shell blog-page-container">
      {/* ---------- Hero Section ---------- */}
      <section className="blog-hero-section">
        <div className="blog-hero-content">
          <span className="blog-eyebrow">MOVODREAM JOURNAL</span>
          <h1>
            Exploring <span className="gradient-text">{category.name}</span>
          </h1>
          <p className="blog-hero-lead">
            Deep dives, insights, and stories on {category.name} shaping the future of intelligent travel.
          </p>

          <div className="crumb-pill-wrap">
            <Link href="/blog" className="crumb-back-link">
              ← Back to All Articles
            </Link>
          </div>
        </div>

        <div className="blog-hero-visual">
          <div className="mascot-glow-backdrop" />
          <div className="mascot-image-wrap">
            <Image
              src="/assets/images/blog_hero_mascot.webp"
              alt="Movodream AI Travel Companion"
              fill
              sizes="(max-width: 768px) 90vw, 440px"
              priority
              quality={85}
              className="mascot-img"
            />
          </div>
          <div className="floating-badge badge-1">🧠</div>
          <div className="floating-badge badge-2">✈️</div>
          <div className="floating-badge badge-3">📅</div>
        </div>
      </section>

      {/* ---------- Category Filter Bar ---------- */}
      <BlogCategoryFilter categories={categories} activeCategory={category.slug} />

      <main className="page-main blog-main-content">
        {posts.length === 0 ? (
          <div className="blog-empty-card">
            <div className="blog-empty-icon-wrap">✨</div>
            <h3>Fresh stories brewing in {category.name}</h3>
            <p>
              Our editorial team is crafting new insights and deep-dives for this category. Explore our published articles or check back soon!
            </p>
            <Link href="/blog" className="blog-empty-cta">
              ← Explore All Articles
            </Link>
          </div>
        ) : (
          <div className="featured-grid">
            {posts.map((post) => (
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
                      {post.author?.name && (() => {
                        const rawAvatar = post.author.avatar
                        const authorAvatarUrl = typeof rawAvatar === 'string'
                          ? rawAvatar.trim() || null
                          : (rawAvatar as { url?: string } | undefined)?.url?.trim() || null
                        const initial = post.author.name.trim().charAt(0).toUpperCase()

                        return (
                          <div className="author-pill">
                            {authorAvatarUrl ? (
                              <Image
                                src={authorAvatarUrl}
                                alt={post.author.name}
                                width={18}
                                height={18}
                                className="author-avatar-img"
                              />
                            ) : (
                              <span className="author-initial">{initial}</span>
                            )}
                            <span className="author-name">By {post.author.name}</span>
                          </div>
                        )
                      })()}
                      <span className="meta-text">
                        {(post.publishedAt || post.createdAt) && (
                          <>
                            {formatDate(post.publishedAt || post.createdAt)}{' '}
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
        )}
      </main>
    </div>
  )
}
