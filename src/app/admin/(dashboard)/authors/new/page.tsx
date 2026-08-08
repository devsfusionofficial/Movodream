import { AuthorForm } from '../author-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { UserRound } from 'lucide-react'

export default function NewAuthorPage() {
  return <AdminFormPage backHref="/admin/authors" backLabel="Back to authors" title="Create an author profile" description="Give every story a clear voice with a polished author identity and social presence." eyebrow="Content team" icon={UserRound}><AuthorForm /></AdminFormPage>
}
