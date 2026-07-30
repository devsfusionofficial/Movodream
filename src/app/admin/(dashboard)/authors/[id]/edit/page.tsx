import { notFound } from 'next/navigation'
import { getAuthor } from '@/actions/authors'
import { AuthorForm } from '../../author-form'

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = await getAuthor(id)
  if (!author) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit author</h1>
      <AuthorForm
        authorId={id}
        defaultValues={{
          name: author.name,
          bio: author.bio,
          avatarUrl: author.avatar?.url,
          avatarKey: author.avatar?.key,
          twitter: author.socialLinks?.twitter,
          linkedin: author.socialLinks?.linkedin,
          website: author.socialLinks?.website,
        }}
      />
    </div>
  )
}
