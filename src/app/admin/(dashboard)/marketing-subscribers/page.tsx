import Link from 'next/link'
import { Download, Mail, RefreshCw } from 'lucide-react'
import { listSubscribers } from '@/actions/subscribers'
import { requirePagePermission } from '@/lib/auth-guard'
import { Button } from '@/components/ui/button'
import { MarketingSubscribersFilter, type SubscriberItem } from './marketing-subscribers-filter'

export default async function MarketingSubscribersPage() {
  await requirePagePermission('subscribers', ['read'])
  const rawSubscribers = await listSubscribers()
  const subscribers = JSON.parse(JSON.stringify(rawSubscribers)) as SubscriberItem[]
  const active = subscribers.filter((subscriber) => subscriber.status === 'active')
  const rate = subscribers.length ? Math.round((active.length / subscribers.length) * 100) : 0

  return (
    <div className="admin-resource-page space-y-4">
      <div className="flex flex-col gap-5 border-b border-[#e7e7e7] pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d71789]">Audience</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#21182a]">Marketing Subscribers</h1>
          <p className="mt-2 text-base text-[#6b7276]">View and manage people who opted into marketing emails.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]">
            <RefreshCw className="h-4 w-4" />
            Sync subscribers
          </Button>
          <Button variant="outline" render={<a href="/api/admin/subscribers/export" />} className="gap-2 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            render={<Link href="/admin/marketing-subscribers/compose" />}
            className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white hover:opacity-95 shadow-[0_6px_18px_rgba(215,23,137,0.25)] border-0"
          >
            <Mail className="h-4 w-4" />
            Compose email
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total users', subscribers.length, 'text-[#21182a]'],
          ['Opted in', active.length, 'text-[#d71789]'],
          ['Opted out / not opted in', subscribers.length - active.length, 'text-[#747a7d]'],
          ['Opt-in rate', `${rate}%`, 'text-[#21182a]'],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-xl border border-[#ebe6ee] bg-white px-5 py-5 shadow-xs">
            <p className="text-sm text-[#687075]">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      <MarketingSubscribersFilter subscribers={subscribers} />
    </div>
  )
}
