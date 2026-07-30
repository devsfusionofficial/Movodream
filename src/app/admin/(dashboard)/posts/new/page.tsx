import { listAuthors } from '@/actions/authors'
import { listCategories } from '@/actions/categories'
import { listTags } from '@/actions/tags'
import { PostForm } from '../post-form'

export default async function NewPostPage() {
  const [authors, categories, tags] = await Promise.all([listAuthors(), listCategories(), listTags()])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New post</h1>
      <PostForm authors={authors} categories={categories} tags={tags} />
    </div>
  )
}
