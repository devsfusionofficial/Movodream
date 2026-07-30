import { notFound } from 'next/navigation'
import { getPartner } from '@/actions/partners'
import { PartnerForm } from '../../partner-form'

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = await getPartner(id)
  if (!partner) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit partner</h1>
      <PartnerForm
        partnerId={id}
        defaultValues={{
          name: partner.name,
          url: partner.url,
          category: partner.category,
          logoUrl: partner.logo?.url,
          logoKey: partner.logo?.key,
          order: partner.order,
        }}
      />
    </div>
  )
}
