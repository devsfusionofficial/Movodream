import { listUsers } from '@/actions/users'
import { requirePagePermission } from '@/lib/auth-guard'
import { CreateUserDialog } from './create-user-dialog'
import { UsersTable } from './users-table'

export default async function UsersPage() {
  await requirePagePermission('user', ['list'])
  const users = await listUsers()

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Team permissions</p>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Users</h1>
          <p className="mt-3 text-sm text-[#887f8e]">Manage team accounts and workspace access roles.</p>
        </div>
        <CreateUserDialog />
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-4.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
        <UsersTable users={users} />
      </section>
    </div>
  )
}
