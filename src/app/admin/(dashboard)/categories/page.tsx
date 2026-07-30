import Link from 'next/link'
import { listCategories } from '@/actions/categories'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function CategoriesPage() {
  const categories = await listCategories()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button render={<Link href="/admin/categories/new" />}>New category</Button>
      </div>
      <DataTable columns={columns} data={categories} searchColumnId="name" searchPlaceholder="Search categories…" />
    </div>
  )
}
