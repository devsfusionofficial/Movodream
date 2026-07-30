import Link from 'next/link'

type PostCardPost = {
  _id: string
  slug: string
  title: string
  excerpt?: string
  heroImage?: { url?: string }
  readingTime?: number
  categories?: { _id: string; name: string; slug: string }[]
}

export function PostCard({ post }: { post: PostCardPost }) {
  const category = post.categories?.[0]

  return (
    <Link href={`/blog/${post.slug}`} className="post-card">
      {post.heroImage?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.heroImage.url} alt="" className="post-card-image" />
      ) : (
        <div className="post-card-image" />
      )}
      <div className="post-card-body">
        {category && <div className="post-card-category">{category.name}</div>}
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className="post-card-meta">
          <span>{post.readingTime ?? 1} min read</span>
        </div>
      </div>
    </Link>
  )
}
