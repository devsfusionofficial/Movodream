import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostBySlug, getRelatedPosts } from '@/lib/queries/posts'
import { PostCard } from '../post-card'

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="post-detail-hero">
        {post.categories && post.categories.length > 0 && (
          <div className="post-detail-categories">
            {(post.categories as unknown as { _id: string; name: string; slug: string }[]).map((c) => (
              <Link key={c._id} href={`/blog/category/${c.slug}`} className="blog-category-pill">
                {c.name}
              </Link>
            ))}
          </div>
        )}
        <h1>{post.title}</h1>
        <div className="post-detail-meta">
          {author?.name && <span>By {author.name}</span>}
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
          <span>{post.readingTime ?? 1} min read</span>
        </div>
      </section>

      {post.heroImage?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.heroImage.url} alt="" className="post-detail-image" />
      )}

      <main
        className="post-detail-body"
        dangerouslySetInnerHTML={{ __html: post.contentHtml || `<p>${post.excerpt ?? ''}</p>` }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="post-detail-tags">
          {(post.tags as unknown as { _id: string; name: string; slug: string }[]).map((t) => (
            <span key={t._id} className="blog-category-pill">
              {t.name}
            </span>
          ))}
        </div>
      )}

      <div className="post-detail-share">
        <span>Share</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <i className="fa-brands fa-x-twitter" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <i className="fa-brands fa-linkedin" />
        </a>
      </div>

      {author?.name && (
        <div className="post-detail-author">
          {author.avatar?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.avatar.url} alt="" />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e5e5e8' }} />
          )}
          <div>
            <div className="name">{author.name}</div>
            {author.bio && <div className="bio">{author.bio}</div>}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="post-related">
          <h2>Related posts</h2>
          <div className="blog-grid" style={{ marginTop: 24 }}>
            {related.map((r) => (
              <PostCard key={r._id} post={r} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
