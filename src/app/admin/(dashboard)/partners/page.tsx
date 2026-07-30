import Link from 'next/link'
import { listPartners } from '@/actions/partners'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function PartnersPage() {
  const partners = await listPartners()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Partners</h1>
        <Button render={<Link href="/admin/partners/new" />}>New partner</Button>
      </div>
      <DataTable columns={columns} data={partners} searchColumnId="name" searchPlaceholder="Search partners…" />
    </div>
  )
}
