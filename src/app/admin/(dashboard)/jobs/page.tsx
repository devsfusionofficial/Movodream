import Link from 'next/link'
import { listJobs } from '@/actions/jobs'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function JobsPage() {
  const jobs = await listJobs()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <Button render={<Link href="/admin/jobs/new" />}>New job</Button>
      </div>
      <DataTable columns={columns} data={jobs} searchColumnId="title" searchPlaceholder="Search jobs…" />
    </div>
  )
}
