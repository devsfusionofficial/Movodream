import { OfficeForm } from '../office-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { MapPin } from 'lucide-react'

export default function NewOfficePage() {
  return <AdminFormPage backHref="/admin/offices" backLabel="Back to offices" title="Add a new office" description="Create a polished destination profile for your network of offices and local teams." eyebrow="Directory" icon={MapPin}><OfficeForm /></AdminFormPage>
}
