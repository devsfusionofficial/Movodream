import Link from 'next/link'
import { listApplications } from '@/actions/applications'
import { APPLICATION_STATUSES } from '@/lib/application-status'
import { DataTable } from '@/components/admin/data-table'
import { columns } from './columns'

type PageProps = { searchParams: Promise<{ status?: string }> }

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const { status } = await searchParams
  const all = await listApplications()
  const applications = status ? all.filter((a) => a.status === status) : all

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Applications</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/applications"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !status ? 'border-foreground bg-foreground text-background' : 'border-input text-foreground/70'
          }`}
        >
          All
        </Link>
        {APPLICATION_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/applications?status=${encodeURIComponent(s)}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              status === s ? 'border-foreground bg-foreground text-background' : 'border-input text-foreground/70'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <DataTable columns={columns} data={applications} searchColumnId="name" searchPlaceholder="Search candidates…" />
    </div>
  )
}
