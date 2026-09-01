import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'
import { subscribeSchema } from '@/lib/validation/subscriber'

export async function POST(request: Request) {
  // Safe JSON parsing & schema validation
  const body = await request.json().catch(() => null)
  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Enter a valid email address' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const normalizedEmail = parsed.data.email.toLowerCase().trim()

  try {
    await connectDB()
    const existing = await Subscriber.findOne({ email: normalizedEmail })

    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active'
        existing.subscribedAt = new Date()
        await existing.save()
      }
      // Already active or re-activated — treat as success
      return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
    }

    try {
      await Subscriber.create({ email: normalizedEmail, status: 'active' })
    } catch (err: any) {
      // Handle concurrent race conditions gracefully
      if (err?.code !== 11000) throw err
    }

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json(
      { success: false, error: 'Unable to complete subscription. Please try again.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
