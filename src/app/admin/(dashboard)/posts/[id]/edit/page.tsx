import { notFound } from 'next/navigation'
import { getPost } from '@/actions/posts'
import { listAuthors } from '@/actions/authors'
import { listCategories } from '@/actions/categories'
import { listTags } from '@/actions/tags'
import { PostForm } from '../../post-form'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, authors, categories, tags] = await Promise.all([
    getPost(id),
    listAuthors(),
    listCategories(),
    listTags(),
  ])
  if (!post) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit post</h1>
      <PostForm
        postId={id}
        authors={authors}
        categories={categories}
        tags={tags}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentJson: post.contentJson,
          contentHtml: post.contentHtml,
          heroImageUrl: post.heroImage?.url,
          heroImageKey: post.heroImage?.key,
          authorId: (post.author as unknown as string) ?? '',
          categoryIds: (post.categories as unknown as string[]) ?? [],
          tagIds: (post.tags as unknown as string[]) ?? [],
          status: post.status,
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
          seoTitle: post.seo?.title,
          seoDescription: post.seo?.description,
          seoOgImage: post.seo?.ogImage,
        }}
      />
    </div>
  )
}
