import Link from 'next/link'
import { Download, Mail, RefreshCw, Search, Users } from 'lucide-react'
import { listSubscribers } from '@/actions/subscribers'
import { Button } from '@/components/ui/button'

export default async function MarketingSubscribersPage() {
  const subscribers = await listSubscribers()
  const active = subscribers.filter((subscriber) => subscriber.status === 'active')
  const rate = subscribers.length ? Math.round((active.length / subscribers.length) * 100) : 0
  return (
    <div className="admin-resource-page space-y-7">
      <div className="flex flex-col gap-5 border-b border-[#e7e7e7] pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6c7377]">Audience</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-[#111]">Marketing Subscribers</h1><p className="mt-2 text-base text-[#6b7276]">View and manage people who opted into marketing emails.</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Sync subscribers</Button><Button variant="outline" render={<a href="/api/admin/subscribers/export" />} className="gap-2"><Download className="h-4 w-4" />Export CSV</Button><Button render={<Link href="/admin/marketing-subscribers/compose" />} className="gap-2 bg-[#3ab187] text-white hover:bg-[#2e9e77]"><Mail className="h-4 w-4" />Compose email</Button></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[['Total users', subscribers.length, 'text-[#111]'], ['Opted in', active.length, 'text-[#0aa347]'], ['Opted out / not opted in', subscribers.length - active.length, 'text-[#747a7d]'], ['Opt-in rate', `${rate}%`, 'text-[#111]']].map(([label, value, color]) => <div key={String(label)} className="rounded-xl border border-[#dedede] bg-white px-5 py-5"><p className="text-base text-[#687075]">{label}</p><p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p></div>)}</div>
      <div className="flex flex-col gap-3 xl:flex-row"><label className="relative block flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858b8f]" /><input className="h-12 w-full rounded-lg border border-[#dedede] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#3ab187]" placeholder="Search by email..." /></label>{['All users', 'All statuses', 'Joined...', 'Exit date...'].map((label) => <select key={label} className="h-12 rounded-lg border border-[#dedede] bg-white px-5 text-sm text-[#333] outline-none focus:border-[#3ab187]"><option>{label}</option></select>)}</div>
      <div className="overflow-hidden rounded-xl border border-[#dedede] bg-white"><div className="grid grid-cols-[1.3fr_2fr_1fr_1fr_1fr] border-b border-[#e5e5e5] px-5 py-4 text-sm font-bold text-[#151515]"><span>Name</span><span>Email</span><span>Marketing</span><span>Joined</span><span>Exit date</span></div>{subscribers.map((subscriber) => <div key={subscriber._id} className="grid grid-cols-[1.3fr_2fr_1fr_1fr_1fr] items-center border-b border-[#ededed] px-5 py-4 text-sm last:border-0"><span className="font-semibold text-[#171717]">Subscriber</span><span className="text-[#71777a]">{subscriber.email}</span><span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${subscriber.status === 'active' ? 'bg-[#d8f8e8] text-[#008d42]' : 'bg-[#f3f3f3] text-[#4b4f52]'}`}>{subscriber.status === 'active' ? 'Opted in' : 'Opted out'}</span></span><span className="text-[#71777a]">{new Date(subscriber.subscribedAt ?? subscriber.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span className="text-[#71777a]">{subscriber.status === 'unsubscribed' ? new Date(subscriber.updatedAt ?? subscriber.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span></div>)}</div>
      {subscribers.length === 0 && <div className="rounded-xl border border-dashed border-[#d8d8d8] bg-white py-16 text-center text-[#747a7d]"><Users className="mx-auto mb-3 h-8 w-8" />No marketing subscribers yet.</div>}
    </div>
  )
}
