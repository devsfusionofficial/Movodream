import Link from 'next/link'
import { listTags } from '@/actions/tags'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function TagsPage() {
  const tags = await listTags()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tags</h1>
        <Button render={<Link href="/admin/tags/new" />}>New tag</Button>
      </div>
      <DataTable columns={columns} data={tags} searchColumnId="name" searchPlaceholder="Search tags…" />
    </div>
  )
}
