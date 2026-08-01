import { JobForm } from '../job-form'

export default function NewJobPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New job</h1>
      <JobForm />
    </div>
  )
}
