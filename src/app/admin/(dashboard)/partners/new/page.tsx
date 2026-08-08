import { PartnerForm } from '../partner-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { Handshake } from 'lucide-react'

export default function NewPartnerPage() {
  return <AdminFormPage backHref="/admin/partners" backLabel="Back to partners" title="Add a new partner" description="Introduce a trusted partner with the brand details your audience should see." eyebrow="Directory" icon={Handshake}><PartnerForm /></AdminFormPage>
}
