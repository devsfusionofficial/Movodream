import Link from 'next/link'
import { listAuthors } from '@/actions/authors'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function AuthorsPage() {
  const authors = await listAuthors()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Authors</h1>
        <Button render={<Link href="/admin/authors/new" />}>New author</Button>
      </div>
      <DataTable columns={columns} data={authors} searchColumnId="name" searchPlaceholder="Search authors…" />
    </div>
  )
}
