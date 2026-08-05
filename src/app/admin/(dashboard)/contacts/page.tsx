import { listContactSubmissions } from '@/actions/contacts'
import { DataTable } from '@/components/admin/data-table'
import { PageHeader } from '@/components/admin/page-header'
import { columns } from './columns'

export default async function ContactsPage() {
  const submissions = await listContactSubmissions()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Contact-form submissions from the public site."
        count={submissions.length}
      />
      <DataTable
        columns={columns}
        data={submissions}
        searchable
        searchPlaceholder="Search by name, email or phone…"
        emptyMessage="No enquiries yet."
      />
    </div>
  )
}
