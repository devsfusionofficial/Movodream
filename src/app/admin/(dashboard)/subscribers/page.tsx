import { listSubscribers } from '@/actions/subscribers'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function SubscribersPage() {
  const subscribers = await listSubscribers()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Subscribers</h1>
        <Button variant="outline" render={<a href="/api/admin/subscribers/export" />}>
          Export CSV
        </Button>
      </div>
      <DataTable columns={columns} data={subscribers} searchColumnId="email" searchPlaceholder="Search subscribers…" />
    </div>
  )
}
