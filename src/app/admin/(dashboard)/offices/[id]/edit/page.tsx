import { notFound } from 'next/navigation'
import { getOffice } from '@/actions/offices'
import { OfficeForm } from '../../office-form'

export default async function EditOfficePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const office = await getOffice(id)
  if (!office) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit office</h1>
      <OfficeForm
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
      />
    </div>
  )
}
