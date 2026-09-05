'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BriefcaseBusiness, FileText, FolderKanban, Globe2, Inbox, LayoutDashboard, Menu, PanelLeftClose, Tags, Users, UserRound, X } from 'lucide-react'
import { roles, type AppRole } from '@/lib/permissions'

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; requires?: { resource: keyof typeof import('@/lib/permissions').statement; action: string } }

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  { label: 'Overview', items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Content', items: [
    { href: '/admin/posts', label: 'Posts', icon: FileText, requires: { resource: 'posts', action: 'read' } },
    { href: '/admin/categories', label: 'Categories', icon: FolderKanban, requires: { resource: 'categories', action: 'read' } },
    { href: '/admin/tags', label: 'Tags', icon: Tags, requires: { resource: 'tags', action: 'read' } },
    { href: '/admin/authors', label: 'Authors', icon: UserRound, requires: { resource: 'authors', action: 'read' } },
  ] },
  { label: 'Operations', items: [
    { href: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness, requires: { resource: 'jobs', action: 'read' } },
    { href: '/admin/applications', label: 'Applications', icon: Users, requires: { resource: 'applications', action: 'read' } },
    { href: '/admin/contacts', label: 'Enquiries', icon: Inbox, requires: { resource: 'contacts', action: 'read' } },
    { href: '/admin/marketing-subscribers', label: 'Marketing subscribers', icon: Globe2, requires: { resource: 'subscribers', action: 'read' } },
  ] },
  { label: 'Directory', items: [
    { href: '/admin/offices', label: 'Offices', icon: Globe2, requires: { resource: 'offices', action: 'read' } },
    { href: '/admin/partners', label: 'Partners', icon: FolderKanban, requires: { resource: 'partners', action: 'read' } },
    { href: '/admin/users', label: 'Users', icon: Users, requires: { resource: 'user', action: 'list' } },
  ] },
]

function canSee(role: AppRole, item: NavItem) {
  if (!item.requires) return true
  return roles[role]?.authorize({ [item.requires.resource]: [item.requires.action] } as never)?.success ?? false
}

export function Sidebar({ role }: { role: AppRole }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const visibleGroups = NAV_GROUPS.map((group) => ({ ...group, items: group.items.filter((item) => canSee(role, item)) })).filter((group) => group.items.length)

  return (
    <>
      <button type="button" aria-label="Open navigation" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6e1e9] bg-white text-[#2a1936] shadow-sm lg:hidden"><Menu className="h-5 w-5" /></button>
      {open && <button type="button" aria-label="Close navigation overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-[#160a21]/40 backdrop-blur-sm lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[272px] shrink-0 flex-col border-r border-[#eee9f0] bg-[#1b0d27] text-white shadow-2xl outline-none transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:min-h-0 lg:translate-x-0 lg:self-start lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 min-w-0">
            <Image
              src="/assets/images/logo2-opt.webp"
              alt="Movodream"
              width={110}
              height={28}
              priority
              className="h-[22px] w-auto brightness-[1.35] contrast-[1.05] shrink-0"
            />
            <span className="hidden sm:block border-l border-white/15 pl-2 text-[8px] font-medium uppercase leading-tight tracking-[0.16em] text-white/45 shrink-0">
              admin<br />workspace
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-4 outline-none [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin]">
          {visibleGroups.map((group) => <div key={group.label} className="mb-4"><p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">{group.label}</p><div className="space-y-1">{group.items.map((item) => { const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href); const Icon = item.icon; return <Link key={item.href} href={item.href} prefetch={true} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition ${active ? 'bg-gradient-to-r from-[#d71789]/25 to-transparent text-white border-l-2 border-[#d71789] font-semibold' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}><Icon className={`h-[17px] w-[17px] ${active ? 'text-[#ff7294]' : 'text-white/40'}`} />{item.label}</Link> })}</div></div>)}
        </div>
        <div className="border-t border-white/10 p-5"><div className="flex items-center gap-3 rounded-xl bg-white/6 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7294] text-xs font-bold text-[#35102c]">{role.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="text-xs font-semibold capitalize text-white">{role} account</p><p className="mt-0.5 text-[10px] text-white/40">Movodream team</p></div><Link href="/" onClick={() => setOpen(false)} aria-label="Go to Movodream website" className="ml-auto rounded-lg p-1.5 text-white/35 transition hover:bg-white/10 hover:text-[#ff9ab2]"><PanelLeftClose className="h-4 w-4" /></Link></div></div>
      </aside>
    </>
  )
}
