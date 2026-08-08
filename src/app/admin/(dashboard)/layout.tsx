import { Bell, ChevronRight, ShieldCheck } from 'lucide-react'
import { requireSession } from '@/lib/auth-guard'
import { Sidebar } from '@/components/admin/sidebar'
import { SignOutButton } from '@/components/admin/sign-out-button'
import type { AppRole } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'editor') as AppRole
  const name = session.user.name ?? session.user.email?.split('@')[0] ?? 'Admin'

  return (
    <div className="admin-shell min-h-screen bg-[#f7f7f8] text-[#21182a] lg:flex lg:items-start">
      <Sidebar role={role} />
      <div className="admin-shell-content flex min-w-0 flex-1 flex-col" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
        <header className="flex h-[82px] items-center justify-between border-b border-[#eee9f0] bg-white px-6 pl-[72px] sm:px-8 sm:pl-[88px] lg:pl-10">
          <div className="flex items-center gap-2 text-xs text-[#968e9c]"><span className="hidden sm:inline">Workspace</span><ChevronRight className="hidden h-3.5 w-3.5 sm:inline" /><span className="font-medium text-[#4d4353]">Overview</span></div>
          <div className="admin-header-actions flex items-center gap-2 rounded-2xl border border-[#eee8f0] bg-white p-1.5 shadow-[0_5px_18px_rgba(34,20,40,0.04)]" style={{ outline: 'none' }}><button type="button" aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#8d8493] transition hover:bg-[#f8f3f8] hover:text-[#d71789]"><Bell className="h-[17px] w-[17px]" /><span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d71789] ring-2 ring-white" /></button><div className="hidden items-center gap-2 px-2 sm:flex"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fce8f2] text-xs font-bold text-[#b40d6d]">{name.slice(0, 1).toUpperCase()}</span><div className="min-w-0 text-left"><p className="text-xs font-semibold leading-4 text-[#33283a]">{name}</p><p className="max-w-[170px] truncate text-[10px] leading-4 text-[#9b929e]">{session.user.email}</p></div></div><div className="sm:hidden"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fce8f2] text-xs font-bold text-[#b40d6d]">{name.slice(0, 1).toUpperCase()}</span></div><SignOutButton /></div>
        </header>
        <main className="flex-1 px-5 py-7 outline-none sm:px-8 sm:py-9 lg:px-10">{children}</main>
        <div className="px-5 pb-6 text-[11px] text-[#aaa2ad] sm:px-8 lg:px-10">Movodream Admin · Secure workspace <ShieldCheck className="ml-1 inline h-3 w-3 text-[#d71789]" /></div>
      </div>
    </div>
  )
}
