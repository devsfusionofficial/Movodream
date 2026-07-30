import { listUsers } from '@/actions/users'
import { DataTable } from '@/components/admin/data-table'
import { CreateUserDialog } from './create-user-dialog'
import { columns } from './columns'

export default async function UsersPage() {
  const users = await listUsers()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <CreateUserDialog />
      </div>
      <DataTable columns={columns} data={users} searchColumnId="email" searchPlaceholder="Search users…" />
    </div>
  )
}
