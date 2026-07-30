import { AuthorForm } from '../author-form'

export default function NewAuthorPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New author</h1>
      <AuthorForm />
    </div>
  )
}
