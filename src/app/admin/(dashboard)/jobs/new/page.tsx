import { JobForm } from '../job-form'
import { AdminFormPage } from '@/components/admin/admin-form-page'
import { BriefcaseBusiness } from 'lucide-react'

export default function NewJobPage() {
  return <AdminFormPage backHref="/admin/jobs" backLabel="Back to jobs" title="Create a new opportunity" description="Publish a thoughtful role page that makes the next step clear for the right candidates." eyebrow="Operations" icon={BriefcaseBusiness}><JobForm /></AdminFormPage>
}
