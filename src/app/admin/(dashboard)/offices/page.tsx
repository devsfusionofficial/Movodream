import Link from 'next/link'
import { Building2, Compass, Globe2, MapPin, Plus } from 'lucide-react'
import { listOffices } from '@/actions/offices'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function OfficesPage() {
  const offices = await listOffices()
  const live = offices.filter((office) => office.status === 'live').length
  const upcoming = offices.length - live

  return (
    <div className="mx-auto max-w-[1440px] space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Global directory</p><h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Offices</h1><p className="mt-3 text-sm text-[#887f8e]">Keep every destination, team, and local presence easy to discover.</p></div><Button render={<Link href="/admin/offices/new" />} className="h-11 rounded-xl bg-[#241235] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(36,18,53,0.16)] hover:bg-[#351747]"><Plus className="h-4 w-4" />New office</Button></div>

      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#6b43bb]"><Building2 className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a49aa9]">Directory</span></div><p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{offices.length}</p><p className="mt-1 text-xs text-[#857c8b]">Total locations</p></div><div className="rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f8f0] text-[#167044]"><MapPin className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a49aa9]">Live now</span></div><p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{live}</p><p className="mt-1 text-xs text-[#857c8b]">Active offices</p></div><div className="rounded-2xl border border-[#ebe6ee] bg-[linear-gradient(115deg,#241235,#4c194e)] p-5 text-white shadow-[0_8px_20px_rgba(36,18,53,0.12)]"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#ff9ab2]"><Compass className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Coming soon</span></div><p className="mt-5 text-2xl font-semibold tracking-[-0.05em]">{upcoming}</p><p className="mt-1 text-xs text-white/55">Locations in progress</p></div></div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex flex-col gap-4 border-b border-[#f0edf1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-[15px] font-semibold text-[#2b2032]">Office directory</h2><p className="mt-1 text-xs text-[#978e9e]">Manage the cities and local teams represented across the network.</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]"><Globe2 className="h-3.5 w-3.5" />{offices.length} locations</span></div><div className="p-5 sm:p-6"><DataTable columns={columns} data={offices} searchColumnId="city" searchPlaceholder="Search cities…" /></div></section>
    </div>
  )
}
