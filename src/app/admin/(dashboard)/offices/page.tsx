import Link from 'next/link'
import { listOffices } from '@/actions/offices'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function OfficesPage() {
  const offices = await listOffices()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Offices</h1>
        <Button render={<Link href="/admin/offices/new" />}>New office</Button>
      </div>
      <DataTable columns={columns} data={offices} searchColumnId="city" searchPlaceholder="Search offices…" />
    </div>
  )
}
