import { TagForm } from '../tag-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { Tag } from 'lucide-react'

export default function NewTagPage() {
  return <AdminFormPage backHref="/admin/tags" backLabel="Back to tags" title="Create a new tag" description="Organize your stories with a focused topic readers can discover across the site." eyebrow="Content taxonomy" icon={Tag}><TagForm /></AdminFormPage>
}
