import { notFound } from 'next/navigation'
import { getPartner } from '@/actions/partners'
import { PartnerForm } from '../../partner-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { Handshake } from 'lucide-react'

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = await getPartner(id)
  if (!partner) notFound()

  return <AdminFormPage backHref="/admin/partners" backLabel="Back to partners" title="Edit partner" description="Keep this partner profile current and aligned with the public directory experience." eyebrow="Directory" icon={Handshake}><PartnerForm
        partnerId={id}
        defaultValues={{
          name: partner.name,
          url: partner.url,
          category: partner.category,
          logoUrl: partner.logo?.url,
          logoKey: partner.logo?.key,
          order: partner.order,
        }}
      /></AdminFormPage>
}
