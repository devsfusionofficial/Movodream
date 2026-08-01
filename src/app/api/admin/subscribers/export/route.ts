import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

export async function GET() {
  try {
    await requirePermission('subscribers', ['export'])
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean()

  const rows = [
    ['Email', 'Status', 'Subscribed At'],
    ...subscribers.map((s) => [s.email, s.status, new Date(s.subscribedAt ?? s.createdAt).toISOString()]),
  ]
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
