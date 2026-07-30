import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { ContactSubmission } from '@/models/ContactSubmission'
import { contactSchema } from '@/lib/validation/contact'
import { sendContactNotification } from '@/lib/mailer'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid submission' }, { status: 400 })
  }

  await connectDB()

  const emailSent = await sendContactNotification(parsed.data).catch(() => false)

  await ContactSubmission.create({ ...parsed.data, emailSent })

  return NextResponse.json({ success: true })
}
