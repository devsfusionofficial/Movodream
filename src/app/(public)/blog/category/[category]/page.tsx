import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByCategorySlug, getAllCategories } from '@/lib/queries/posts'
import { PostCard } from '../../post-card'
import { BlogToolbar } from '../../blog-toolbar'

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
    <div className="page-shell">
      <section className="page-crumb">
        <Link href="/">Home</Link> › <Link href="/blog">Blog</Link> › <span>{category.name}</span>
      </section>

      <section className="page-head">
        <span className="page-eyebrow">Category</span>
        <h1>
          <span className="p">{category.name}</span>
        </h1>
        <p className="page-head-lead">
          {posts.length} post{posts.length === 1 ? '' : 's'} in this category.
        </p>
      </section>

      <main className="page-main">
        <BlogToolbar categories={categories} activeCategory={category.slug} />

        {posts.length === 0 ? (
          <div className="page-empty">No posts in this category yet.</div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
