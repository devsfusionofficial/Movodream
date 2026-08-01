import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'
import { subscribeSchema } from '@/lib/validation/subscriber'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Enter a valid email address' }, { status: 400 })
  }

  await connectDB()
  const existing = await Subscriber.findOne({ email: parsed.data.email })

  if (existing) {
    if (existing.status === 'unsubscribed') {
      existing.status = 'active'
      existing.subscribedAt = new Date()
      await existing.save()
    }
    // Already active — treat as success either way so re-submitting the
    // same email isn't a visible error for the visitor.
    return NextResponse.json({ success: true })
  }

  await Subscriber.create({ email: parsed.data.email })
  return NextResponse.json({ success: true })
}
