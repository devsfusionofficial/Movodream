import { requireSession } from '@/lib/auth-guard'
import { AdminShell } from '@/components/admin/admin-shell'
import type { AppRole } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'admin') as AppRole
  const name = session.user.name ?? session.user.email?.split('@')[0] ?? 'Admin'
  const email = session.user.email ?? ''

  return (
    <AdminShell role={role} name={name} email={email}>
      {children}
    </AdminShell>
  )
}
