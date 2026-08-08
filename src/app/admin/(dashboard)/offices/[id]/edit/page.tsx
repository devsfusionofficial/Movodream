import { notFound } from 'next/navigation'
import { getOffice } from '@/actions/offices'
import { OfficeForm } from '../../office-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { MapPin } from 'lucide-react'

export default async function EditOfficePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const office = await getOffice(id)
  if (!office) notFound()

  return <AdminFormPage backHref="/admin/offices" backLabel="Back to offices" title="Edit office" description="Keep this office profile accurate so visitors always have the right destination details." eyebrow="Directory" icon={MapPin}><OfficeForm
        officeId={id}
        defaultValues={{
          city: office.city,
          slug: office.slug,
          address: office.address,
          gmbLink: office.gmbLink,
          status: office.status,
          description: office.description,
          imageUrl: office.image?.url,
          imageKey: office.image?.key,
          order: office.order,
        }}
      /></AdminFormPage>
}
