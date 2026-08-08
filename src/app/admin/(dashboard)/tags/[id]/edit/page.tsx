import { notFound } from 'next/navigation'
import { getTag } from '@/actions/tags'
import { TagForm } from '../../tag-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { Tag } from 'lucide-react'

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tag = await getTag(id)
  if (!tag) notFound()

  return <AdminFormPage backHref="/admin/tags" backLabel="Back to tags" title="Edit tag" description="Keep this topic clear, consistent, and easy to find across your publishing workflow." eyebrow="Content taxonomy" icon={Tag}><TagForm tagId={id} defaultValues={{ name: tag.name, slug: tag.slug }} /></AdminFormPage>
}
