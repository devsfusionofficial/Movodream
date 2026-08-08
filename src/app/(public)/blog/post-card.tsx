import Link from 'next/link'
import Image from 'next/image'

type PostCardPost = {
  _id: string
  slug: string
  title: string
  excerpt?: string
  heroImage?: { url?: string }
  readingTime?: number
  publishedAt?: string
  createdAt?: string
  categories?: { _id: string; name: string; slug: string }[]
}

export function PostCard({ post }: { post: PostCardPost }) {
  const category = post.categories?.[0]
  const date = post.publishedAt ?? post.createdAt

  return (
    <Link href={`/blog/${post.slug}`} className="post-tile">
      <div className="post-tile-media">
        {post.heroImage?.url && (
          <Image src={post.heroImage.url} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 360px" />
        )}
      </div>
      <div className="post-tile-body">
        {category && <span className="post-tile-cat">{category.name}</span>}
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className="post-tile-meta">
          {date && <>{new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · </>}
          {post.readingTime ?? 1} min read
        </div>
      </div>
    </Link>
  )
}
