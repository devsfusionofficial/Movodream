import { Inbox } from 'lucide-react'
import { listContactSubmissions } from '@/actions/contacts'
import { requirePagePermission } from '@/lib/auth-guard'
import { DataTable } from '@/components/admin/data-table'
import { columns } from './columns'

export default async function ContactsPage() {
  await requirePagePermission('contacts', ['read'])
  const submissions = await listContactSubmissions()

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Communications</p>
        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Enquiries</h1>
        <p className="mt-3 text-sm text-[#887f8e]">Review contact form submissions and messages from users.</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-4.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
        <DataTable
          title="Inbox enquiries"
          description="Messages sent from the contact form."
          searchColumnId="email"
          searchPlaceholder="Search enquiries by email..."
          headerActions={
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]">
              <Inbox className="h-3.5 w-3.5" />
              {submissions.length} enquiries
            </span>
          }
          columns={columns}
          data={submissions}
        />
      </section>
    </div>
  )
}
