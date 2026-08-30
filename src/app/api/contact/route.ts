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

  // Save to database immediately (~10-20ms)
  const submission = await ContactSubmission.create({
    ...parsed.data,
    emailSent: false,
  })

  // Dispatch email notification asynchronously in background without blocking user response
  sendContactNotification(parsed.data)
    .then(async (sent) => {
      if (sent) {
        await ContactSubmission.updateOne({ _id: submission._id }, { emailSent: true }).catch(() => {})
      }
    })
    .catch((err) => {
      console.error('Background contact notification error:', err)
    })

  // Instant response to the visitor
  return NextResponse.json({ success: true })
}
