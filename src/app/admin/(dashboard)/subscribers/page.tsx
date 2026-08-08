import { listSubscribers } from '@/actions/subscribers'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { CampaignComposer } from './campaign-composer'

export default async function SubscribersPage() {
  const subscribers = await listSubscribers()

  return (
    <div className="admin-resource-page space-y-7">
      <div className="flex flex-col gap-5 border-b border-[#eee9f0] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c20c73]">Audience</p><h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#21182a]">Subscribers</h1><p className="mt-2 text-sm text-[#887f8e]">Build thoughtful campaigns for people who opted in to hear from Movodream.</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" render={<a href="/api/admin/subscribers/export" />}>Export CSV</Button><CampaignComposer activeCount={subscribers.filter((subscriber) => subscriber.status === 'active').length} /></div>
      </div>
      <DataTable columns={columns} data={subscribers} searchColumnId="email" searchPlaceholder="Search subscribers…" />
    </div>
  )
}
