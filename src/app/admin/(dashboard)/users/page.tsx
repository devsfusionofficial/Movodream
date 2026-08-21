import { listUsers } from '@/actions/users'
import { DataTable } from '@/components/admin/data-table'
import { CreateUserDialog } from './create-user-dialog'
import { columns } from './columns'

export default async function UsersPage() {
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
        <DataTable
          title="User directory"
          description="Active accounts with admin workspace access."
          searchColumnId="email"
          searchPlaceholder="Search users..."
          headerActions={
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]">
              {users.length} accounts
            </span>
          }
          columns={columns}
          data={users}
        />
      </section>
    </div>
  )
}
