import { CategoryForm } from '../category-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { FolderKanban } from 'lucide-react'

export default function NewCategoryPage() {
  return <AdminFormPage backHref="/admin/categories" backLabel="Back to categories" title="Create a new category" description="Build a clear editorial structure that helps readers browse your content with confidence." eyebrow="Content taxonomy" icon={FolderKanban}><CategoryForm /></AdminFormPage>
}
