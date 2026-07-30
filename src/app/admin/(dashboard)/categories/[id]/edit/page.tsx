import { notFound } from 'next/navigation'
import { getCategory } from '@/actions/categories'
import { CategoryForm } from '../../category-form'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(id)
  if (!category) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit category</h1>
      <CategoryForm categoryId={id} defaultValues={{ name: category.name, slug: category.slug }} />
    </div>
  )
}
