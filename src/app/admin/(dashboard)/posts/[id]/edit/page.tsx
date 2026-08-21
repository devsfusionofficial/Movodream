import { notFound } from 'next/navigation'
import { getPost } from '@/actions/posts'
import { listAuthors } from '@/actions/authors'
import { listCategories } from '@/actions/categories'
import { listTags } from '@/actions/tags'
import { PostForm } from '../../post-form'
import Link from 'next/link'
import { ArrowLeft, FilePenLine } from 'lucide-react'

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
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-5 border-b border-[#ebe6ee] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#a18f9f] transition hover:text-[#b40d6d]"><ArrowLeft className="h-3.5 w-3.5" />Back to posts</Link>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]"><FilePenLine className="h-[18px] w-[18px]" /></span><div><h1 className="text-3xl font-semibold tracking-[-0.055em] text-[#21182a]">Edit post</h1><p className="mt-1 text-sm text-[#887f8e]">Refine the story and keep your audience moving.</p></div></div>
        </div>
        <span className="w-fit rounded-full border border-[#eee5ee] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a18f9f]">Content editor</span>
      </div>
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
