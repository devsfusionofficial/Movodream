import { notFound } from 'next/navigation'
import { getAuthor } from '@/actions/authors'
import { AuthorForm } from '../../author-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { UserRound } from 'lucide-react'

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = await getAuthor(id)
  if (!author) notFound()

  return <AdminFormPage backHref="/admin/authors" backLabel="Back to authors" title="Edit author profile" description="Refresh the author’s identity, biography, and public links without losing editorial context." eyebrow="Content team" icon={UserRound}><AuthorForm
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
      /></AdminFormPage>
}
