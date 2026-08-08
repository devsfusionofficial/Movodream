import Link from 'next/link'
import { Handshake, Network, Plus, Sparkles, UsersRound } from 'lucide-react'
import { listPartners } from '@/actions/partners'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function PartnersPage() {
  const partners = await listPartners()
  const categories = new Set(partners.map((partner) => partner.category).filter(Boolean)).size

  return (
    <div className="admin-resource-page mx-auto max-w-[1440px] space-y-7" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Partner network</p><h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Partners</h1><p className="mt-3 text-sm text-[#887f8e]">Build and maintain the network that helps every journey go further.</p></div><Button render={<Link href="/admin/partners/new" />} className="h-11 rounded-xl bg-[#241235] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(36,18,53,0.16)] hover:bg-[#351747]"><Plus className="h-4 w-4" />New partner</Button></div>

      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]"><Handshake className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a49aa9]">Network</span></div><p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{partners.length}</p><p className="mt-1 text-xs text-[#857c8b]">Active partners</p></div><div className="rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#6b43bb]"><Network className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a49aa9]">Coverage</span></div><p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{categories}</p><p className="mt-1 text-xs text-[#857c8b]">Partner categories</p></div><div className="rounded-2xl border border-[#ebe6ee] bg-[linear-gradient(115deg,#241235,#4c194e)] p-5 text-white shadow-[0_8px_20px_rgba(36,18,53,0.12)]"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#ff9ab2]"><UsersRound className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Collaboration</span></div><p className="mt-5 text-sm font-semibold">Stronger together.</p><p className="mt-1 max-w-sm text-xs leading-5 text-white/55">Keep partner relationships visible, organized, and ready to grow.</p></div></div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex flex-col gap-4 border-b border-[#f0edf1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-[15px] font-semibold text-[#2b2032]">Partner directory</h2><p className="mt-1 text-xs text-[#978e9e]">Manage the organizations supporting the Movodream ecosystem.</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]"><Sparkles className="h-3.5 w-3.5" />{partners.length} partners</span></div><div className="p-5 sm:p-6"><DataTable columns={columns} data={partners} searchColumnId="name" searchPlaceholder="Search partners…" /></div></section>
    </div>
  )
}
