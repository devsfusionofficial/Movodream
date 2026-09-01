import { NextResponse, after } from 'next/server'
import { connectDB } from '@/lib/db'
import { ContactSubmission } from '@/models/ContactSubmission'
import { contactSchema } from '@/lib/validation/contact'
import { sendContactNotification } from '@/lib/mailer'

export async function POST(request: Request) {
  // Safe JSON parsing & schema validation
  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  try {
    await connectDB()

    // 3. Persist submission immediately
    const submission = await ContactSubmission.create({
      ...parsed.data,
      emailSent: false,
    })

    // 4. Dispatch email notification safely using Next.js after()
    // This keeps the serverless runtime alive on Vercel until the email sends
    after(async () => {
      try {
        const sent = await sendContactNotification(parsed.data)
        if (sent) {
          await connectDB()
          await ContactSubmission.updateOne({ _id: submission._id }, { emailSent: true }).catch(() => {})
        }
      } catch (err) {
        console.error('Background contact notification error:', err)
      }
    })

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Contact submission error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact enquiry. Please try again.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
