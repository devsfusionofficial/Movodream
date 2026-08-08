import { notFound } from 'next/navigation'
import { getCategory } from '@/actions/categories'
import { CategoryForm } from '../../category-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { FolderKanban } from 'lucide-react'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(id)
  if (!category) notFound()

  return <AdminFormPage backHref="/admin/categories" backLabel="Back to categories" title="Edit category" description="Refine the name and URL used to group related stories across the site." eyebrow="Content taxonomy" icon={FolderKanban}><CategoryForm categoryId={id} defaultValues={{ name: category.name, slug: category.slug }} /></AdminFormPage>
}
