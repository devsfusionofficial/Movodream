import Link from 'next/link'
import { roles, type AppRole } from '@/lib/permissions'

type NavItem = {
  href: string
  label: string
  // Resource + at least one action the current role must have to see this
  // link. Omit to always show (e.g. the dashboard home).
  requires?: { resource: keyof typeof import('@/lib/permissions').statement; action: string }
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts', requires: { resource: 'posts', action: 'read' } },
  { href: '/admin/categories', label: 'Categories', requires: { resource: 'categories', action: 'read' } },
  { href: '/admin/tags', label: 'Tags', requires: { resource: 'tags', action: 'read' } },
  { href: '/admin/authors', label: 'Authors', requires: { resource: 'authors', action: 'read' } },
  { href: '/admin/jobs', label: 'Jobs', requires: { resource: 'jobs', action: 'read' } },
  { href: '/admin/applications', label: 'Applications', requires: { resource: 'applications', action: 'read' } },
  { href: '/admin/subscribers', label: 'Subscribers', requires: { resource: 'subscribers', action: 'read' } },
  { href: '/admin/offices', label: 'Offices', requires: { resource: 'offices', action: 'read' } },
  { href: '/admin/partners', label: 'Partners', requires: { resource: 'partners', action: 'read' } },
  { href: '/admin/users', label: 'Users', requires: { resource: 'user', action: 'list' } },
]

function canSee(role: AppRole, item: NavItem) {
  if (!item.requires) return true
  const roleDef = roles[role]
  return roleDef?.authorize({ [item.requires.resource]: [item.requires.action] } as never)?.success ?? false
}

export function Sidebar({ role }: { role: AppRole }) {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r bg-muted/20 p-4">
      <div className="mb-4 px-2 text-sm font-semibold">Movodream Admin</div>
      {NAV_ITEMS.filter((item) => canSee(role, item)).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
