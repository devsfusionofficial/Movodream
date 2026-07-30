import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByCategorySlug, getAllCategories } from '@/lib/queries/posts'
import { PostCard } from '../../post-card'

type PageProps = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params
  const { category } = await getPostsByCategorySlug(slug)
  if (!category) return {}

  return {
    title: `${category.name} | Movodream Blog`,
    description: `Movodream blog posts about ${category.name}.`,
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
    <>
      <section className="content-hero">
        <h1>{category.name}</h1>
        <p>{posts.length} post{posts.length === 1 ? '' : 's'}</p>
      </section>

      <main className="content-body" style={{ maxWidth: 1100 }}>
        <div className="blog-toolbar">
          <div className="blog-categories">
            <Link href="/blog" className="blog-category-pill">
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/blog/category/${c.slug}`}
                className={`blog-category-pill${c.slug === category.slug ? ' active' : ''}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="blog-empty">No posts in this category yet.</div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
