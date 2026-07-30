import { notFound } from 'next/navigation'
import { getTag } from '@/actions/tags'
import { TagForm } from '../../tag-form'

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tag = await getTag(id)
  if (!tag) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit tag</h1>
      <TagForm tagId={id} defaultValues={{ name: tag.name, slug: tag.slug }} />
    </div>
  )
}
