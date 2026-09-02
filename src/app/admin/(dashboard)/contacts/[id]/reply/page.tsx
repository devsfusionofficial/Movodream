import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { connectDB } from '@/lib/db'
import { ContactSubmission } from '@/models/ContactSubmission'
import { requirePagePermission } from '@/lib/auth-guard'
import { ContactCompose } from '../../contact-compose'

export const maxDuration = 60

export default async function ContactReplyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePagePermission('contacts', ['read'])
  const { id } = await params

  await connectDB()
  let submission: any = null
  try {
    submission = await ContactSubmission.findById(id).lean()
  } catch {
    notFound()
  }

  if (!submission) {
    notFound()
  }

  return (
    <div className="admin-resource-page mx-auto max-w-[1440px] space-y-4 outline-none">
      <Link
        href="/admin/contacts"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#887f8e] transition-colors hover:text-[#d71789]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to enquiries
      </Link>
      <ContactCompose
        id={String(submission._id)}
        name={submission.name}
        email={submission.email}
        phone={submission.phone}
        originalMessage={submission.message}
        createdAt={submission.createdAt?.toISOString?.() || String(submission.createdAt || '')}
      />
    </div>
  )
}
