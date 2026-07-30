import { requireSession } from '@/lib/auth-guard'
import { Sidebar } from '@/components/admin/sidebar'
import { SignOutButton } from '@/components/admin/sign-out-button'
import type { AppRole } from '@/lib/permissions'

// Session-gated on every request; never statically prerendered.
export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'editor') as AppRole

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <SignOutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
