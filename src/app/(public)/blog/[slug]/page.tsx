import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPostBySlug, getRelatedPosts } from '@/lib/queries/posts'
import { PostCard } from '../post-card'
import { ArticleShare } from './article-share'
import { formatDate } from '@/lib/date-format'

type PageProps = { params: Promise<{ slug: string }> }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://movodream.com'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.seo?.title || `${post.title} | Movodream Blog`,
    description: post.seo?.description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: post.seo?.ogImage || post.heroImage?.url ? [post.seo?.ogImage || post.heroImage!.url!] : undefined,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post)
  const postUrl = `${SITE_URL}/blog/${post.slug}`
  const author = post.author as unknown as { name?: string; bio?: string; avatar?: { url?: string } } | null

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.heroImage?.url ? [post.heroImage.url] : undefined,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: author?.name ? { '@type': 'Person', name: author.name } : undefined,
      publisher: { '@type': 'Organization', name: 'Movodream' },
      mainEntityOfPage: postUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 2, name: post.title, item: postUrl },
      ],
    },
  ]

  const category = (post.categories as unknown as { _id: string; name: string; slug: string }[] | undefined)?.[0]
  const published = post.publishedAt ? new Date(post.publishedAt) : null

  return (
    <div className="page-shell article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="page-crumb">
        <Link href="/">Home</Link> › <Link href="/blog">Blog</Link> › <span>{post.title}</span>
      </section>

      <section className="article-layout">
        <ArticleShare url={postUrl} title={post.title} />

        <article className="article-body">
          <header className="article-head">
            {category && (
              <Link href={`/blog/category/${category.slug}`} className="article-cat">
                {category.name}
              </Link>
            )}
            <h1>{post.title}</h1>
            {post.excerpt && <p className="article-standfirst">{post.excerpt}</p>}

            <div className="article-byline">
              <span className="article-avatar">
                {author?.avatar?.url ? (
                  <Image src={author.avatar.url} alt="" width={36} height={36} />
                ) : (
                  <span aria-hidden="true">{(author?.name ?? 'M').slice(0, 1)}</span>
                )}
              </span>
              <strong>{author?.name ?? 'Movodream Team'}</strong>
              <i>·</i>
              {published && (
                <>
                  <time dateTime={published.toISOString()}>
                    {formatDate(published)}
                  </time>
                  <i>·</i>
                </>
              )}
              <span>{post.readingTime ?? 1} min read</span>
            </div>
          </header>

          {post.heroImage?.url && (
            <div className="article-hero">
              <Image src={post.heroImage.url} alt="" fill sizes="(max-width: 900px) 100vw, 760px" priority />
            </div>
          )}

          <div
            className="page-prose article-prose"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || `<p>${post.excerpt ?? ''}</p>` }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="page-pills article-tags">
              {(post.tags as unknown as { _id: string; name: string; slug: string }[]).map((t) => (
                <span key={t._id} className="page-pill">
                  {t.name}
                </span>
              ))}
            </div>
          )}

          <aside className="article-author">
            <span className="article-author-avatar">
              {author?.avatar?.url ? (
                <Image src={author.avatar.url} alt="" width={56} height={56} />
              ) : (
                <span aria-hidden="true">{(author?.name ?? 'M').slice(0, 1)}</span>
              )}
            </span>
            <div>
              <h3>{author?.name ?? 'Movodream Team'}</h3>
              {author?.bio && <p>{author.bio}</p>}
              <Link href="/blog" className="article-author-link">
                View all articles →
              </Link>
            </div>
          </aside>
        </article>
      </section>

      {related.length > 0 && (
        <section className="article-more">
          <div className="article-more-head">
            <h2>Continue reading</h2>
            <Link href="/blog">View all articles →</Link>
          </div>
          <div className="post-grid">
            {related.map((r) => (
              <PostCard key={r._id} post={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
