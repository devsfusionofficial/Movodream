'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { ContactSubmission } from '@/models/ContactSubmission'
import { sendDirectEnquiryReply } from '@/lib/mailer'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

/**
 * Contact-form enquiries submitted through the public site's contact modal.
 * These were being written to the database by /api/contact with no admin
 * screen to read them, so every enquiry was effectively invisible.
 */
export async function listContactSubmissions() {
  await requirePermission('contacts', ['read'])
  await connectDB()
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).lean()
  return serialize(submissions)
}

export async function deleteContactSubmission(id: string): Promise<ActionResult> {
  await requirePermission('contacts', ['delete'])
  await connectDB()
  try {
    await ContactSubmission.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete submission' }
  }

  revalidatePath('/admin/contacts')
  return { success: true }
}

export async function replyToContactSubmission(input: {
  to: string
  subject: string
  message: string
  recipientName?: string
}): Promise<ActionResult> {
  await requirePermission('contacts', ['read'])
  if (!input.to || !input.to.includes('@')) {
    return { success: false, error: 'A valid recipient email address is required.' }
  }
  if (!input.message || !input.message.trim()) {
    return { success: false, error: 'Please enter a message to send.' }
  }

  const res = await sendDirectEnquiryReply({
    to: input.to.trim(),
    subject: input.subject.trim() || 'Re: Movodream Enquiry',
    message: input.message.trim(),
    recipientName: input.recipientName,
  })

  if (!res.success) {
    return { success: false, error: res.error }
  }

  return { success: true }
}

